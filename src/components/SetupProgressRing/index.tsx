export interface SetupProgressRingProps {
  /** Completion fraction from 0 to 1. */
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

const TRACK_COLOR = '#e4e4e7'
const PROGRESS_COLOR = '#a153ff'

const SetupProgressRing = ({ value, size = 20, strokeWidth = 2, className = '' }: SetupProgressRingProps) => {
  const clamped = Math.min(1, Math.max(0, value))
  const isComplete = clamped >= 1
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped)
  const center = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true">
      {isComplete ? (
        <>
          <circle cx={center} cy={center} r={radius} fill={PROGRESS_COLOR} />
          <path
            d={`M${center - 3.5} ${center} l2.2 2.2 l4.8 -4.8`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <circle cx={center} cy={center} r={radius} fill="none" stroke={TRACK_COLOR} strokeWidth={strokeWidth} />
          {clamped > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={PROGRESS_COLOR}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          )}
        </>
      )}
    </svg>
  )
}

export default SetupProgressRing
