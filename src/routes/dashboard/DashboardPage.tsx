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
        <Button variant="outline" onClick={() => navigate({ to: '/components' })} className="mb-4">
          View Components
        </Button>

        <div className="mt-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Auth Pages</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/login' })}>
              Login
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/signup' })}>
              Sign Up
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/reset-password' })}>
              Reset Password
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/change-password' })}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
