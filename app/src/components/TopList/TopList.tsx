import React from "react"
import { type Count } from "../../types"
import styles from "./TopList.module.css"

type TopListProps = {
  data: Count
  topX?: number
  title?: string
  className?: string
  style?: React.CSSProperties
}

const TopList: React.FC<TopListProps> = ({
  data,
  topX = 3,
  title,
  className,
  style,
}) => {
  const sortedItems = Object.entries(data)
    .sort(([, first], [, second]) => (second ?? 0) - (first ?? 0))
    .slice(0, topX)

  return (
    <div
      data-testid="toplist"
      className={`${styles.toplistContainer} ${className}`}
      style={style}
    >
      {title && <div className={styles.toplistTitle}>{title}</div>}
      <ul className={styles.toplistList}>
        {sortedItems.map(([item, count]) => (
          <li key={item} className={styles.toplistItem}>
            <strong>{item}</strong>: {count}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopList
