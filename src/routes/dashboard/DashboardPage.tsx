import { useNavigate } from '@tanstack/react-router'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Dashboard" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg mb-6">Your workspace overview lives here.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/components' })}>
          View Components
        </Button>
      </div>
    </div>
  )
}
