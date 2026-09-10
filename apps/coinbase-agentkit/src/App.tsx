import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowLeftRight,
  Coins,
  Droplets,
  FlaskConical,
  Loader2,
  Radio,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  Wallet,
} from "lucide-react"

import { AgentMessageCard } from "@/components/agent-message-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AgentBackend } from "@/lib/agent/types"
import { MockBackend } from "@/lib/agent/mock"
import { probeLiveServer } from "@/lib/agent/live"
import type { AgentContent, ChatMessage, Intent } from "@/lib/chat"
import { DEMO_RECIPIENT, HELP_TEXT, nextId, parseIntent } from "@/lib/chat"

interface ActionChip {
  label: string
  icon: typeof Wallet
  intent: Intent
  transcript: string
}

const CHIPS: ActionChip[] = [
  {
    label: "Create wallet",
    icon: Wallet,
    intent: { type: "create-wallet" },
    transcript: "Create a wallet for me",
  },
  {
    label: "Show address",
    icon: Sparkles,
    intent: { type: "show-address" },
    transcript: "What's my wallet address?",
  },
  {
    label: "Faucet",
    icon: Droplets,
    intent: { type: "faucet" },
    transcript: "Request testnet ETH from the faucet",
  },
  {
    label: "Balances",
    icon: Coins,
    intent: { type: "balances" },
    transcript: "Show my balances",
  },
  {
    label: "Preview transfer",
    icon: SendHorizontal,
    intent: { type: "transfer", to: DEMO_RECIPIENT, amountEth: "0.01" },
    transcript: `Send 0.01 ETH to ${DEMO_RECIPIENT}`,
  },
  {
    label: "Preview swap",
    icon: ArrowLeftRight,
    intent: { type: "swap", fromToken: "ETH", amountIn: "0.01" },
    transcript: "Swap 0.01 ETH to USDC",
  },
]

function agentMessage(content: AgentContent): ChatMessage {
  return { id: nextId(), role: "agent", content }
}

export default function App() {
  const [backend, setBackend] = useState<AgentBackend>(() => new MockBackend())
  const [mode, setMode] = useState<"mock" | "live">("mock")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const live = await probeLiveServer()
      const activeBackend = live ?? new MockBackend()
      if (cancelled) return
      setBackend(activeBackend)
      setMode(activeBackend.mode)

      const wallet = await activeBackend.getWallet().catch(() => null)
      if (cancelled) return
      const greeting = wallet
        ? `Welcome back. Your agent wallet on Base Sepolia is ready — ask for balances, faucet funds, or a transfer/swap preview.`
        : `Hi, I'm your onchain agent on Base Sepolia (${
            activeBackend.mode === "live" ? "live CDP wallet" : "mock mode — no keys needed"
          }). Start by creating a wallet, then try the faucet and previews.`
      setMessages([agentMessage({ kind: "text", text: greeting })])
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, pending])

  const runIntent = useCallback(
    async (intent: Intent, transcript: string) => {
      if (pending) return
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text: transcript }])
      setPending(true)
      try {
        const replies: AgentContent[] = []
        switch (intent.type) {
          case "create-wallet": {
            const existing = await backend.getWallet()
            const wallet = existing ?? (await backend.createWallet())
            replies.push({
              kind: "wallet",
              wallet,
              note: existing
                ? "You already have a wallet — here it is."
                : mode === "live"
                  ? "Fresh CDP server wallet created via the CDP SDK."
                  : "Deterministic demo wallet created (mock mode).",
            })
            break
          }
          case "show-address": {
            const wallet = await backend.getWallet()
            if (!wallet) {
              replies.push({
                kind: "text",
                text: "No wallet yet — tap “Create wallet” first.",
              })
            } else {
              replies.push({ kind: "wallet", wallet, note: "Your agent wallet address." })
            }
            break
          }
          case "faucet": {
            const result = await backend.requestFaucet()
            replies.push({ kind: "faucet", result })
            break
          }
          case "balances": {
            const balances = await backend.getBalances()
            replies.push({ kind: "balances", balances })
            break
          }
          case "transfer": {
            const preview = await backend.previewTransfer(intent.to, intent.amountEth)
            replies.push({ kind: "transfer", preview })
            break
          }
          case "swap": {
            const preview = await backend.previewSwap(intent.fromToken, intent.amountIn)
            replies.push({ kind: "swap", preview })
            break
          }
          case "help":
            replies.push({ kind: "text", text: HELP_TEXT })
            break
          case "unknown":
            replies.push({
              kind: "text",
              text: "I didn't catch that. " + HELP_TEXT,
            })
            break
        }
        setMessages((prev) => [...prev, ...replies.map(agentMessage)])
      } catch (error) {
        const text = error instanceof Error ? error.message : "Something went wrong."
        setMessages((prev) => [...prev, agentMessage({ kind: "error", text })])
      } finally {
        setPending(false)
      }
    },
    [backend, mode, pending],
  )

  const handleSubmit = useCallback(() => {
    const text = input.trim()
    if (!text || pending) return
    setInput("")
    void runIntent(parseIntent(text), text)
  }, [input, pending, runIntent])

  const resetDemo = useCallback(() => {
    localStorage.clear()
    window.location.reload()
  }, [])

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#0052ff] text-white">
            <Wallet className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">Coinbase AgentKit Playground</h1>
            <p className="truncate text-xs text-muted-foreground">
              Onchain agent actions on Base Sepolia
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              base-sepolia
            </Badge>
            {mode === "live" ? (
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                <Radio className="size-3" /> Live
              </Badge>
            ) : (
              <Badge variant="secondary">
                <FlaskConical className="size-3" /> Mock
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={resetDemo} title="Reset demo">
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4">
        <div className="flex-1 space-y-4 overflow-y-auto py-6">
          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#0052ff] px-4 py-2 text-sm text-white">
                  {message.text}
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex justify-start">
                <div className="max-w-[85%]">
                  <AgentMessageCard content={message.content} />
                </div>
              </div>
            ),
          )}
          {pending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Agent is working onchain…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="space-y-3 border-t pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <Button
                key={chip.label}
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => void runIntent(chip.intent, chip.transcript)}
              >
                <chip.icon className="size-3.5" />
                {chip.label}
              </Button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              handleSubmit()
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='Try “swap 0.05 ETH to USDC” or “send 0.01 ETH to 0x…”'
              disabled={pending}
            />
            <Button type="submit" disabled={pending || !input.trim()}>
              <SendHorizontal className="size-4" />
            </Button>
          </form>
          <p className="text-center text-[11px] text-muted-foreground">
            {mode === "live"
              ? "Live mode: real CDP wallet on Base Sepolia testnet (no mainnet, no real funds)."
              : "Mock mode: deterministic demo data — add CDP keys and run the local server for live mode."}
          </p>
        </div>
      </main>
    </div>
  )
}
