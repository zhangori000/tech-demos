export type AgentMode = "mock" | "live"

export const NETWORK = "base-sepolia" as const

export interface WalletInfo {
  address: string
  network: typeof NETWORK
  createdAt: number
}

export interface Balances {
  /** Native ETH, decimal string (e.g. "0.0500") */
  eth: string
  /** Demo USDC, decimal string (e.g. "25.00") */
  usdc: string
}

export interface FaucetResult {
  txHash: string
  amountEth: string
  balances: Balances
}

export interface TransferPreview {
  to: string
  amountEth: string
  gasEth: string
  totalEth: string
  sufficient: boolean
  balanceEth: string
}

export interface SwapPreview {
  fromToken: "ETH" | "USDC"
  toToken: "ETH" | "USDC"
  amountIn: string
  amountOut: string
  rate: string
  slippagePct: string
  network: typeof NETWORK
}

/** One backend interface implemented by both the mock and the live transport. */
export interface AgentBackend {
  mode: AgentMode
  getWallet(): Promise<WalletInfo | null>
  createWallet(): Promise<WalletInfo>
  getBalances(): Promise<Balances>
  requestFaucet(): Promise<FaucetResult>
  previewTransfer(to: string, amountEth: string): Promise<TransferPreview>
  previewSwap(fromToken: "ETH" | "USDC", amountIn: string): Promise<SwapPreview>
}
