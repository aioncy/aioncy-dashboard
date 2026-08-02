import PageHeader from '../../components/PageHeader'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" collaborators={COLLABORATORS} onShare={handleShare} />
      <div className="p-6 md:p-8">
        <p className="text-gray-600 text-lg">Workspace and account preferences.</p>
      </div>
    </div>
  )
}
