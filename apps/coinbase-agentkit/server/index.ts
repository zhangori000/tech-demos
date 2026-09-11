/**
 * Optional live-mode server. Run with `bun run server` after setting
 * CDP_API_KEY_ID, CDP_API_KEY_SECRET and CDP_WALLET_SECRET (see .env.example).
 *
 * Holds the CDP credentials server-side and exposes the same action surface
 * the mock backend implements in the browser. The SPA probes /api/health and
 * switches to live mode only when this server is up with credentials.
 */
import { CdpClient } from "@coinbase/cdp-sdk"

const PORT = 8787
const NETWORK = "base-sepolia"
const ACCOUNT_NAME = "agentkit-playground"
const BASE_SEPOLIA_RPC = "https://sepolia.base.org"
/** Indicative demo rate for the swap preview (no live DEX quotes on Base Sepolia). */
const ETH_USDC_RATE = 2412.37

const hasCreds = Boolean(
  process.env.CDP_API_KEY_ID && process.env.CDP_API_KEY_SECRET && process.env.CDP_WALLET_SECRET,
)

const cdp = hasCreds ? new CdpClient() : null
let cachedAddress: `0x${string}` | null = null
let createdAt = 0

async function getAccount() {
  if (!cdp) throw new Error("CDP credentials missing on the server.")
  const account = await cdp.evm.getOrCreateAccount({ name: ACCOUNT_NAME })
  if (!cachedAddress) {
    cachedAddress = account.address
    createdAt = Date.now()
  }
  return account
}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(BASE_SEPOLIA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  })
  const json = (await res.json()) as { result?: T; error?: { message: string } }
  if (json.error) throw new Error(json.error.message)
  return json.result as T
}

function formatWei(wei: bigint, displayDecimals: number): string {
  const base = 10n ** 18n
  const frac = (wei % base).toString().padStart(18, "0").slice(0, displayDecimals)
  return `${wei / base}.${frac}`
}

function parseEthAmount(value: string): bigint {
  const [whole = "0", frac = ""] = value.split(".")
  return BigInt(whole || "0") * 10n ** 18n + BigInt(frac.padEnd(18, "0").slice(0, 18) || "0")
}

async function getEthBalanceWei(address: string): Promise<bigint> {
  const hex = await rpc<string>("eth_getBalance", [address, "latest"])
  return BigInt(hex)
}

async function getBalances() {
  const account = await getAccount()
  const ethWei = await getEthBalanceWei(account.address)
  let usdc = "0.00"
  if (cdp) {
    const result = await cdp.evm.listTokenBalances({ address: account.address, network: NETWORK })
    const usdcBalance = result.balances.find((b) => b.token.symbol?.toUpperCase() === "USDC")
    if (usdcBalance) {
      const { amount, decimals } = usdcBalance.amount
      const base = 10n ** BigInt(decimals)
      usdc = `${amount / base}.${(amount % base).toString().padStart(Number(decimals), "0").slice(0, 2)}`
    }
  }
  return { eth: formatWei(ethWei, 4), usdc }
}

type Handler = (body: Record<string, unknown>) => Promise<unknown>

const handlers: Record<string, Handler> = {
  "/api/wallet/get": async () => {
    if (!cachedAddress) return null
    return { address: cachedAddress, network: NETWORK, createdAt }
  },
  "/api/wallet/create": async () => {
    const account = await getAccount()
    return { address: account.address, network: NETWORK, createdAt }
  },
  "/api/balances": () => getBalances(),
  "/api/faucet": async () => {
    const account = await getAccount()
    if (!cdp) throw new Error("CDP credentials missing on the server.")
    const { transactionHash } = await cdp.evm.requestFaucet({
      address: account.address,
      network: NETWORK,
      token: "eth",
    })
    // The faucet tx takes a few seconds to land; report the pre-confirmation balance.
    const balances = await getBalances()
    return { txHash: transactionHash, amountEth: "0.0001", balances }
  },
  "/api/transfer/preview": async (body) => {
    const to = String(body.to ?? "")
    const amountEth = String(body.amountEth ?? "0")
    const account = await getAccount()
    const [gasPriceHex, balanceWei] = await Promise.all([
      rpc<string>("eth_gasPrice", []),
      getEthBalanceWei(account.address),
    ])
    const gasWei = BigInt(gasPriceHex) * 21000n
    const amountWei = parseEthAmount(amountEth)
    const totalWei = amountWei + gasWei
    return {
      to,
      amountEth: formatWei(amountWei, 4),
      gasEth: formatWei(gasWei, 6),
      totalEth: formatWei(totalWei, 6),
      sufficient: balanceWei >= totalWei,
      balanceEth: formatWei(balanceWei, 4),
    }
  },
  "/api/swap/preview": async (body) => {
    // CDP swap quotes are mainnet-only, so live mode returns an indicative
    // quote on Base Sepolia rather than executing anything.
    const fromToken = body.fromToken === "USDC" ? "USDC" : "ETH"
    const amountIn = Number.parseFloat(String(body.amountIn ?? "0")) || 0
    const toToken = fromToken === "ETH" ? "USDC" : "ETH"
    const out = fromToken === "ETH" ? amountIn * ETH_USDC_RATE : amountIn / ETH_USDC_RATE
    return {
      fromToken,
      toToken,
      amountIn: amountIn.toFixed(fromToken === "ETH" ? 4 : 2),
      amountOut: out.toFixed(toToken === "ETH" ? 4 : 2),
      rate: `1 ETH ≈ ${ETH_USDC_RATE.toFixed(2)} USDC (indicative)`,
      slippagePct: "0.50",
      network: NETWORK,
    }
  },
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  })
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url)
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS })
    if (pathname === "/api/health") return json(200, { ok: true, live: hasCreds })

    const handler = handlers[pathname]
    if (!handler || req.method !== "POST") return json(404, { ok: false, error: "Not found" })
    try {
      const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
      return json(200, { ok: true, data: await handler(body) })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Server error"
      return json(500, { ok: false, error: message })
    }
  },
})

console.log(
  `AgentKit live server on http://localhost:${PORT} — CDP credentials ${hasCreds ? "found (live mode)" : "MISSING (SPA will stay in mock mode)"}`,
)
