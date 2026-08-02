import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Reports and performance metrics.</p>
      </div>
    </div>
  )
}
