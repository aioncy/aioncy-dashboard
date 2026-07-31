import DropdownListItem from './DropdownListItem'
import type { DropdownListItemProps } from './DropdownListItem'
import styles from './DropdownList.module.scss'

export interface DropdownListProps {
  items: DropdownListItemProps[]
  maxHeight?: number
  className?: string
}

const DropdownList = ({ items, maxHeight, className = '' }: DropdownListProps) => (
  <div className={`${styles.list} ${className}`} style={maxHeight ? { maxHeight } : undefined}>
    {items.map((item, index) => (
      <DropdownListItem key={index} {...item} />
    ))}
  </div>
)

export default DropdownList
