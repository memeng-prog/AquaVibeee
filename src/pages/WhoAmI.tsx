import { useAuth } from '@/context/AuthContext'

export function WhoAmI() {
  const { user, loading } = useAuth()

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Who Am I</h2>
      <div className="mb-4">
        <strong>Loading:</strong> {String(loading)}
      </div>
      <div>
        <strong>User:</strong>
        <pre className="mt-2 bg-white p-4 rounded shadow-sm">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  )
}
