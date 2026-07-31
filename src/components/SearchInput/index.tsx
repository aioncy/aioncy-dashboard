import React from 'react'
import { Search } from 'lucide-react'
import styles from './SearchInput.module.scss'

export interface SearchInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  resultsCount?: number
  className?: string
}

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  resultsCount,
  className = '',
}: SearchInputProps) => (
  <div className={`${styles.container} ${className}`}>
    <span className={styles.icon}>
      <Search size={16} />
    </span>
    <input
      type="search"
      className={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
    />
    {typeof resultsCount === 'number' && (
      <span className={styles.results}>
        {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
      </span>
    )}
  </div>
)

export default SearchInput
