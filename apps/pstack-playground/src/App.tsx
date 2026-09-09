import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptCoach } from '@/components/prompt-coach'
import { SavingsDemo } from '@/components/savings-demo'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">pstack playground</h1>
            <Badge variant="secondary">inspired by pstack 0.15.0</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn the three commands that matter, steal from a library of 50+ real prompts, and
            see why skill stubs save tokens. Demo content — not a live pstack install.
          </p>
        </header>

        <Tabs defaultValue="coach">
          <TabsList className="mb-4">
            <TabsTrigger value="coach">Prompt coach</TabsTrigger>
            <TabsTrigger value="savings">Token savings demo</TabsTrigger>
          </TabsList>
          <TabsContent value="coach">
            <PromptCoach />
          </TabsContent>
          <TabsContent value="savings">
            <SavingsDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
