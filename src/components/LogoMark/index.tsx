export interface LogoMarkProps {
  className?: string
}

const LogoMark = ({ className = '' }: LogoMarkProps) => (
  <svg
    width="52"
    height="56"
    viewBox="0 0 52 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Aioncy"
    className={className}
  >
    <g clip-path="url(#clip0_4140_6610)">
      <rect x="28.5023" y="9.53516" width="11.5453" height="11.5453" rx="5.77266" fill="black" />
      <rect
        x="26.1654"
        y="9.53516"
        width="11.5453"
        height="16.6308"
        rx="5.77266"
        transform="rotate(89.4575 26.1654 9.53516)"
        fill="black"
      />
      <rect x="28.5023" y="23.2799" width="11.5453" height="22.266" rx="5.77266" fill="black" />
      <rect
        x="20.3437"
        y="20.3933"
        width="11.5453"
        height="15.2905"
        rx="5.77266"
        transform="rotate(40.5353 20.3437 20.3933)"
        fill="#A153FF"
      />
    </g>
    <defs>
      <clipPath id="clip0_4140_6610">
        <rect width="52" height="55.0808" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default LogoMark
