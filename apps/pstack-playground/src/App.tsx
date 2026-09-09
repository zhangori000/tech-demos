import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  computeSavings,
  formatTokens,
  formatUsd,
  MODELS,
  ROLES,
  SKILLS,
} from '@/lib/playground-data'

const defaultModels = (): Record<string, string> =>
  Object.fromEntries(ROLES.map((r) => [r.id, r.defaultModelId]))

function App() {
  const [modelByRole, setModelByRole] = useState<Record<string, string>>(defaultModels)
  const [loadedSkills, setLoadedSkills] = useState<Set<string>>(
    () => new Set(SKILLS.slice(0, 2).map((s) => s.id)),
  )

  const savings = useMemo(
    () => computeSavings(modelByRole, loadedSkills),
    [modelByRole, loadedSkills],
  )

  const toggleSkill = (id: string, on: boolean) => {
    setLoadedSkills((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const reset = () => {
    setModelByRole(defaultModels())
    setLoadedSkills(new Set(SKILLS.slice(0, 2).map((s) => s.id)))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">pstack playground</h1>
              <Badge variant="secondary">inspired by pstack 0.15.0</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Assign models to agent roles, stack skills, and watch prompt tokens fall.
              Demo math — not a live pstack install.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent roles</CardTitle>
                <CardDescription>
                  Each role runs several times a day. Pick which model powers it.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {ROLES.map((role) => (
                  <div
                    key={role.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{role.name}</span>
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                          {role.runsPerDay} runs/day
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <Select
                      value={modelByRole[role.id]}
                      onValueChange={(v) =>
                        setModelByRole((prev) => ({ ...prev, [role.id]: v }))
                      }
                    >
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Pick a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODELS.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="flex w-full items-center justify-between gap-3">
                              {m.name}
                              <span className="text-xs text-muted-foreground">
                                ${m.pricePerMTok}/MTok
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill stack</CardTitle>
                <CardDescription>
                  Loading a skill swaps its full instructions (pasted into every prompt) for a
                  tiny metadata stub. Toggle skills on to save tokens.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {SKILLS.map((skill) => {
                  const on = loadedSkills.has(skill.id)
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-4"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-medium">{skill.name}</span>
                          <Badge
                            variant={on ? 'default' : 'outline'}
                            className="font-normal"
                          >
                            {on
                              ? `stub ${formatTokens(skill.stubTokens)} tok`
                              : `inline ${formatTokens(skill.inlineTokens)} tok`}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {skill.description}
                        </p>
                      </div>
                      <Switch
                        checked={on}
                        onCheckedChange={(v) => toggleSkill(skill.id, v)}
                        aria-label={`Load ${skill.name}`}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit lg:sticky lg:top-10">
            <CardHeader>
              <CardTitle>Token savings</CardTitle>
              <CardDescription>
                {loadedSkills.size} of {SKILLS.length} skills loaded
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <div className="text-5xl font-semibold tabular-nums tracking-tight">
                  {savings.savingsPercent.toFixed(1)}%
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  fewer prompt tokens vs. pasting every skill inline
                </p>
                <Progress value={savings.savingsPercent} className="mt-3" />
              </div>

              <Separator />

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Baseline / day</dt>
                  <dd className="font-medium tabular-nums">
                    {formatTokens(savings.baselineTokensPerDay)} tok
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">With skills / day</dt>
                  <dd className="font-medium tabular-nums">
                    {formatTokens(savings.currentTokensPerDay)} tok
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tokens saved / day</dt>
                  <dd className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatTokens(savings.tokensSavedPerDay)} tok
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Cost saved / day</dt>
                  <dd className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatUsd(savings.costSavedPerDay)}
                  </dd>
                </div>
              </dl>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium">Per-role prompt load</p>
                <div className="flex flex-col gap-2">
                  {savings.perRole.map((row) => {
                    const role = ROLES.find((r) => r.id === row.roleId)
                    if (!role) return null
                    const pct =
                      row.baselineTokens === 0
                        ? 0
                        : (row.currentTokens / row.baselineTokens) * 100
                    return (
                      <div key={row.roleId} className="text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span>{role.name}</span>
                          <span className="tabular-nums text-muted-foreground">
                            {formatTokens(row.currentTokens)} / {formatTokens(row.baselineTokens)}{' '}
                            tok · {formatUsd(row.costPerDay)}
                          </span>
                        </div>
                        <Progress value={pct} className="mt-1 h-1.5" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
