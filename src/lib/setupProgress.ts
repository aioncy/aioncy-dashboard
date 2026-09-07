import { useSyncExternalStore } from 'react'

export const SETUP_STEP_IDS = ['channels', 'train', 'deploy'] as const
export type SetupStepId = (typeof SETUP_STEP_IDS)[number]

const STORAGE_KEY = 'aioncy:setup-progress'

const isSetupStepId = (value: unknown): value is SetupStepId =>
  typeof value === 'string' && (SETUP_STEP_IDS as readonly string[]).includes(value)

const readStoredCompleted = (): SetupStepId[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(isSetupStepId) : []
  } catch {
    return []
  }
}

let completed: SetupStepId[] = typeof window !== 'undefined' ? readStoredCompleted() : []
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listener) => listener())

export const completeSetupStep = (id: SetupStepId) => {
  if (completed.includes(id)) return
  completed = [...completed, id]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  emit()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => completed
const getServerSnapshot = (): SetupStepId[] => []

export const useSetupProgress = () => {
  const completedSteps = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    completed: completedSteps,
    total: SETUP_STEP_IDS.length,
    value: completedSteps.length / SETUP_STEP_IDS.length,
    completeStep: completeSetupStep,
  }
}
