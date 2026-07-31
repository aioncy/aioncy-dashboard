export interface CheckIconProps {
  size?: number
  className?: string
}

const CheckIcon = ({ size = 20, className = '' }: CheckIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M16.6666 5L7.49992 14.1667L3.33325 10"
      stroke="#A153FF"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default CheckIcon
