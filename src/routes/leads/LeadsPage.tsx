import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function LeadsPage() {
  return (
    <div>
      <PageHeader title="Leads" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Manage and qualify incoming leads.</p>
      </div>
    </div>
  )
}
