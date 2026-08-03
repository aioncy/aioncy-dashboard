import { Ellipsis } from 'lucide-react'
import styles from './Pagination.module.scss'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

type PageItem = number | 'ellipsis'

const getPages = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] => {
  const from = Math.max(currentPage - siblingCount, 1)
  const to = Math.min(currentPage + siblingCount, totalPages)

  const pageNumbers = new Set<number>([1, totalPages])
  for (let i = from; i <= to; i++) pageNumbers.add(i)

  const sorted = Array.from(pageNumbers).sort((a, b) => a - b)

  const pages: PageItem[] = []
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) pages.push('ellipsis')
    pages.push(page)
  })

  return pages
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const pages = getPages(currentPage, totalPages, siblingCount)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.prevNext}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      <div className={styles.pages}>
        {pages.map((item, i) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">
              <Ellipsis size={20} />
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${styles.page} ${item === currentPage ? styles.active : ''}`}
              aria-current={item === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={styles.prevNext}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
