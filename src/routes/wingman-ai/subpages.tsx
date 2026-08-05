import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function WingmanAIControlPage() {
  return (
    <div>
      <PageHeader title="AI Control" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Configure and manage your AI agent's control settings.</p>
      </div>
    </div>
  )
}

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