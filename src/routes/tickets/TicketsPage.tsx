import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function TicketsPage() {
  return (
    <div>
      <PageHeader title="Tickets" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Track and resolve support tickets.</p>
      </div>
    </div>
  )
}
