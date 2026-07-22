import { Link } from '@tanstack/react-router'
import Button from './components/Button'

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
      <p className="text-gray-600 text-lg">Aioncy Dashboard</p>
      <Link to="/components">
        <Button variant="primary" size="lg">View Components</Button>
      </Link>
    </div>
  )
}

export default App
