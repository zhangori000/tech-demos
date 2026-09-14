import type {
  AgentBackend,
  Balances,
  FaucetResult,
  SwapPreview,
  TransferPreview,
  WalletInfo,
} from "./types"

export const LIVE_SERVER_URL = "http://localhost:8787"

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${LIVE_SERVER_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const json = (await res.json()) as { ok: boolean; data?: T; error?: string }
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? `Live server error (${res.status})`)
  }
  return json.data as T
}

/** Talks to the optional local Bun server that holds the real CDP credentials. */
export class LiveBackend implements AgentBackend {
  readonly mode = "live" as const

  getWallet(): Promise<WalletInfo | null> {
    return post<WalletInfo | null>("/api/wallet/get")
  }

  createWallet(): Promise<WalletInfo> {
    return post<WalletInfo>("/api/wallet/create")
  }

  getBalances(): Promise<Balances> {
    return post<Balances>("/api/balances")
  }

  requestFaucet(): Promise<FaucetResult> {
    return post<FaucetResult>("/api/faucet")
  }

  previewTransfer(to: string, amountEth: string): Promise<TransferPreview> {
    return post<TransferPreview>("/api/transfer/preview", { to, amountEth })
  }

  previewSwap(fromToken: "ETH" | "USDC", amountIn: string): Promise<SwapPreview> {
    return post<SwapPreview>("/api/swap/preview", { fromToken, amountIn })
  }
}

/**
 * Probe the local live server. Returns a LiveBackend when it is up and has
 * CDP credentials, otherwise null (the app then falls back to mock mode).
 */
export async function probeLiveServer(timeoutMs = 1200): Promise<LiveBackend | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(`${LIVE_SERVER_URL}/api/health`, {
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const json = (await res.json()) as { ok: boolean; live: boolean }
    return json.ok && json.live ? new LiveBackend() : null
  } catch {
    return null
  }
}
