import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function WingmanAITrainPage() {
  return (
    <div>
      <PageHeader title="Train" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Train your AI agent with new knowledge and sources.</p>
      </div>
    </div>
  )
}