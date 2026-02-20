import { useHealth } from './hooks/useHealth'

function App() {
  const { data, isLoading, isError } = useHealth()

  const status = isLoading ? 'Checking...' : isError ? 'DOWN' : (data?.status ?? 'UNKNOWN')

  const statusColor =
    status === 'UP'
      ? 'text-emerald-400'
      : status === 'Checking...'
        ? 'text-zinc-400'
        : 'text-red-400'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Neura</h1>
        <p className="text-zinc-400 text-sm">Productivity management</p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="text-zinc-500">Server</span>
          <span className={`font-mono font-semibold ${statusColor}`}>{status}</span>
        </div>
      </div>
    </div>
  )
}

export default App
