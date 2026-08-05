import type { OnboardingData } from '../components/OnboardingFlow'

const STORAGE_KEY = 'aioncy:onboarding'

export const saveOnboarding = async (data: OnboardingData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...data,
      pipelineStage: 'onboarded',
      savedAt: new Date().toISOString(),
    }),
  )
}