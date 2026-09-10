import type {
  Balances,
  FaucetResult,
  SwapPreview,
  TransferPreview,
  WalletInfo,
} from "./agent/types"

export type AgentContent =
  | { kind: "text"; text: string }
  | { kind: "error"; text: string }
  | { kind: "wallet"; wallet: WalletInfo; note: string }
  | { kind: "balances"; balances: Balances }
  | { kind: "faucet"; result: FaucetResult }
  | { kind: "transfer"; preview: TransferPreview }
  | { kind: "swap"; preview: SwapPreview }

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "agent"; content: AgentContent }

export type Intent =
  | { type: "create-wallet" }
  | { type: "show-address" }
  | { type: "faucet" }
  | { type: "balances" }
  | { type: "transfer"; to: string; amountEth: string }
  | { type: "swap"; fromToken: "ETH" | "USDC"; amountIn: string }
  | { type: "help" }
  | { type: "unknown" }

export const DEMO_RECIPIENT = "0x000000000000000000000000000000000000dEaD"

let counter = 0
export function nextId(): string {
  counter += 1
  return `msg-${Date.now()}-${counter}`
}

const ADDRESS_RE = /0x[0-9a-fA-F]{40}/
const AMOUNT_RE = /\d+(?:\.\d+)?/

/** Keyword router standing in for a real LLM tool-calling loop. */
export function parseIntent(raw: string): Intent {
  const text = raw.toLowerCase()

  if (/\bhelp\b|what can you do/.test(text)) return { type: "help" }

  if (/\b(create|new|make|set ?up)\b.*\bwallet\b|\bwallet\b.*\b(create|new)\b/.test(text)) {
    return { type: "create-wallet" }
  }

  if (/\b(address|wallet|who are you|account)\b/.test(text) && !/\b(send|transfer|swap)\b/.test(text)) {
    if (/\baddress\b|\bwallet\b/.test(text)) return { type: "show-address" }
  }

  if (/\b(faucet|fund|gimme|top ?up|testnet eth)\b/.test(text)) return { type: "faucet" }

  if (/\b(balance|balances|holdings|how much)\b/.test(text)) return { type: "balances" }

  if (/\b(send|transfer|pay)\b/.test(text)) {
    const to = raw.match(ADDRESS_RE)?.[0] ?? DEMO_RECIPIENT
    const amountEth = text.match(AMOUNT_RE)?.[0] ?? "0.01"
    return { type: "transfer", to, amountEth }
  }

  if (/\b(swap|trade|convert)\b/.test(text)) {
    const fromToken: "ETH" | "USDC" = /\busdc\b.*\b(to|for|into)\b.*\beth\b/.test(text)
      ? "USDC"
      : "ETH"
    const amountIn = text.match(AMOUNT_RE)?.[0] ?? (fromToken === "ETH" ? "0.01" : "10")
    return { type: "swap", fromToken, amountIn }
  }

  return { type: "unknown" }
}

export const HELP_TEXT =
  "I'm an AgentKit-style onchain agent on Base Sepolia. Try: \u201ccreate a wallet\u201d, \u201cshow my address\u201d, \u201crequest faucet funds\u201d, \u201cshow balances\u201d, \u201csend 0.01 ETH to 0x\u2026\u201d, or \u201cswap 0.01 ETH to USDC\u201d \u2014 or just tap an action chip below."
