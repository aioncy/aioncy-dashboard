export interface LogoGlyphProps {
  width?: number
  height?: number
  className?: string
  /** Color of the non-accent marks. */
  markColor?: string
}

/** The four-shape Aioncy mark without its padding box (see LogoMark for the padded version). */
const LogoGlyph = ({ width = 23.471, height = 27.7, className, markColor = '#000' }: LogoGlyphProps) => (
  <svg width={width} height={height} viewBox="0 0 23.471 27.7" fill="none" aria-hidden="true" className={className}>
    <rect x="14.59" width="8.881" height="8.881" rx="5.286" fill={markColor} />
    <rect x="1.9975" y="-1.8955" width="8.881" height="12.793" rx="5.286" transform="rotate(89.46 6.438 4.501)" fill={markColor} />
    <rect x="14.59" y="10.57" width="8.881" height="17.128" rx="5.286" fill={markColor} />
    <rect x="3.4265" y="9.8245" width="8.881" height="11.762" rx="5.286" transform="rotate(40.54 7.867 15.7055)" fill="#A153FF" />
  </svg>
)

export default LogoGlyph
