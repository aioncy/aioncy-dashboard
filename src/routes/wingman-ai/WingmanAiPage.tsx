import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function WingmanAiPage() {
  return (
    <div>
      <PageHeader title="Wingman AI" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">AI-assisted workflows and automations.</p>
      </div>
    </div>
  )
}
