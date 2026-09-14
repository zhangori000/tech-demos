import type {
  AgentBackend,
  Balances,
  FaucetResult,
  SwapPreview,
  TransferPreview,
  WalletInfo,
} from "./types"
import { NETWORK } from "./types"

const STORAGE_KEY = "coinbase-agentkit-demo:v1"
const SEED = "coinbase-agentkit-demo-wallet-seed"
const FAUCET_AMOUNT_ETH = 0.05
/** Deterministic demo quote, roughly in the ballpark of real ETH/USDC. */
const ETH_USDC_RATE = 2412.37
const GAS_ETH = 0.000021

interface MockState {
  wallet: WalletInfo | null
  ethWei: string // bigint as string, 18 decimals
  usdcMicro: string // bigint as string, 6 decimals
  txNonce: number
}

function loadState(): MockState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as MockState
  } catch {
    // fall through to fresh state
  }
  return { wallet: null, ethWei: "0", usdcMicro: "0", txNonce: 0 }
}

function saveState(state: MockState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/** EIP-55-looking (but unchecksummed) deterministic demo address. */
async function deriveAddress(seed: string): Promise<string> {
  const hex = await sha256Hex(seed)
  return `0x${hex.slice(0, 40)}`
}

async function fakeTxHash(nonce: number): Promise<string> {
  const hex = await sha256Hex(`${SEED}:tx:${nonce}`)
  return `0x${hex}`
}

function formatUnits(value: bigint, decimals: number, displayDecimals: number): string {
  const base = 10n ** BigInt(decimals)
  const whole = value / base
  const frac = value % base
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, displayDecimals)
  return `${whole}.${fracStr}`
}

function parseUnits(value: string, decimals: number): bigint {
  const [whole = "0", frac = ""] = value.split(".")
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals)
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0")
}

function toBalances(state: MockState): Balances {
  return {
    eth: formatUnits(BigInt(state.ethWei), 18, 4),
    usdc: formatUnits(BigInt(state.usdcMicro), 6, 2),
  }
}

/** Simulated network latency so the UI's pending states are visible. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class MockBackend implements AgentBackend {
  readonly mode = "mock" as const
  private state: MockState

  constructor() {
    this.state = loadState()
  }

  async getWallet(): Promise<WalletInfo | null> {
    return this.state.wallet
  }

  async createWallet(): Promise<WalletInfo> {
    await delay(700)
    if (this.state.wallet) return this.state.wallet
    const wallet: WalletInfo = {
      address: await deriveAddress(SEED),
      network: NETWORK,
      createdAt: Date.now(),
    }
    this.state.wallet = wallet
    saveState(this.state)
    return wallet
  }

  async getBalances(): Promise<Balances> {
    this.requireWallet()
    await delay(450)
    return toBalances(this.state)
  }

  async requestFaucet(): Promise<FaucetResult> {
    this.requireWallet()
    await delay(1100)
    const amount = parseUnits(String(FAUCET_AMOUNT_ETH), 18)
    this.state.ethWei = (BigInt(this.state.ethWei) + amount).toString()
    this.state.txNonce += 1
    saveState(this.state)
    return {
      txHash: await fakeTxHash(this.state.txNonce),
      amountEth: FAUCET_AMOUNT_ETH.toFixed(4),
      balances: toBalances(this.state),
    }
  }

  async previewTransfer(to: string, amountEth: string): Promise<TransferPreview> {
    this.requireWallet()
    await delay(600)
    const amount = parseUnits(amountEth, 18)
    const gas = parseUnits(String(GAS_ETH), 18)
    const total = amount + gas
    const balance = BigInt(this.state.ethWei)
    return {
      to,
      amountEth: formatUnits(amount, 18, 4),
      gasEth: formatUnits(gas, 18, 6),
      totalEth: formatUnits(total, 18, 6),
      sufficient: balance >= total,
      balanceEth: formatUnits(balance, 18, 4),
    }
  }

  async previewSwap(fromToken: "ETH" | "USDC", amountIn: string): Promise<SwapPreview> {
    this.requireWallet()
    await delay(800)
    const input = Number.parseFloat(amountIn)
    const out = fromToken === "ETH" ? input * ETH_USDC_RATE : input / ETH_USDC_RATE
    const toToken = fromToken === "ETH" ? "USDC" : "ETH"
    return {
      fromToken,
      toToken,
      amountIn: input.toFixed(fromToken === "ETH" ? 4 : 2),
      amountOut: out.toFixed(toToken === "ETH" ? 4 : 2),
      rate: `1 ETH ≈ ${ETH_USDC_RATE.toFixed(2)} USDC`,
      slippagePct: "0.50",
      network: NETWORK,
    }
  }

  private requireWallet() {
    if (!this.state.wallet) {
      throw new Error("No wallet yet — create one first.")
    }
  }
}
