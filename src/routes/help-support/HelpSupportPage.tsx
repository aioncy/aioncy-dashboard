import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function HelpSupportPage() {
  return (
    <div>
      <PageHeader title="Help &amp; Support" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Documentation, guides, and contact options.</p>
      </div>
    </div>
  )
}
