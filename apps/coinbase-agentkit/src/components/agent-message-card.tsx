import {
  ArrowLeftRight,
  CheckCircle2,
  Coins,
  Droplets,
  SendHorizontal,
  Wallet,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { AgentContent } from "@/lib/chat"

function shortAddress(address: string): string {
  return `${address.slice(0, 8)}…${address.slice(-6)}`
}

function shortHash(hash: string): string {
  return `${hash.slice(0, 12)}…${hash.slice(-8)}`
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
    </div>
  )
}

export function AgentMessageCard({ content }: { content: AgentContent }) {
  switch (content.kind) {
    case "text":
      return <p className="text-sm leading-relaxed">{content.text}</p>

    case "error":
      return (
        <p className="flex items-start gap-2 text-sm text-destructive">
          <XCircle className="mt-0.5 size-4 shrink-0" />
          {content.text}
        </p>
      )

    case "wallet":
      return (
        <Card className="w-full max-w-sm gap-3 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Wallet className="size-4 text-primary" /> Agent wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            <p className="text-xs text-muted-foreground">{content.note}</p>
            <p className="break-all rounded-md bg-muted px-2 py-1.5 font-mono text-xs">
              {content.wallet.address}
            </p>
            <Row label="Network" value={content.wallet.network} />
          </CardContent>
        </Card>
      )

    case "balances":
      return (
        <Card className="w-full max-w-sm gap-3 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Coins className="size-4 text-primary" /> Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            <Row label="ETH" value={`${content.balances.eth} ETH`} />
            <Separator />
            <Row label="USDC" value={`${content.balances.usdc} USDC`} />
          </CardContent>
        </Card>
      )

    case "faucet":
      return (
        <Card className="w-full max-w-sm gap-3 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Droplets className="size-4 text-primary" /> Faucet funds received
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            <Row label="Amount" value={`+${content.result.amountEth} ETH`} />
            <Row label="New ETH balance" value={`${content.result.balances.eth} ETH`} />
            <Row label="Tx hash" value={shortHash(content.result.txHash)} mono />
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" /> Confirmed on Base Sepolia
            </p>
          </CardContent>
        </Card>
      )

    case "transfer":
      return (
        <Card className="w-full max-w-sm gap-3 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <SendHorizontal className="size-4 text-primary" /> Transfer preview
              <Badge variant="secondary" className="ml-auto">
                dry run
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            <Row label="To" value={shortAddress(content.preview.to)} mono />
            <Row label="Amount" value={`${content.preview.amountEth} ETH`} />
            <Row label="Est. gas" value={`${content.preview.gasEth} ETH`} />
            <Separator />
            <Row label="Total" value={`${content.preview.totalEth} ETH`} />
            {content.preview.sufficient ? (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Balance covers it (
                {content.preview.balanceEth} ETH available)
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <XCircle className="size-3.5" /> Insufficient balance (
                {content.preview.balanceEth} ETH available) — try the faucet first
              </p>
            )}
          </CardContent>
        </Card>
      )

    case "swap":
      return (
        <Card className="w-full max-w-sm gap-3 py-4">
          <CardHeader className="px-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ArrowLeftRight className="size-4 text-primary" /> Swap quote
              <Badge variant="secondary" className="ml-auto">
                preview
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4">
            <Row
              label="You pay"
              value={`${content.preview.amountIn} ${content.preview.fromToken}`}
            />
            <Row
              label="You receive"
              value={`≈ ${content.preview.amountOut} ${content.preview.toToken}`}
            />
            <Separator />
            <Row label="Rate" value={content.preview.rate} />
            <Row label="Max slippage" value={`${content.preview.slippagePct}%`} />
          </CardContent>
        </Card>
      )
  }
}
