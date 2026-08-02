import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function ConversationsPage() {
  return (
    <div>
      <PageHeader title="Conversations" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Customer conversations across channels.</p>
      </div>
    </div>
  )
}
