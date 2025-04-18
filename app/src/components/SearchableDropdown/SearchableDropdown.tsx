import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  useRef,
  useCallback,
} from "react"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import styles from "./SearchableDropdown.module.css"

type Option = {
  code: string
  name: string
}

type SearchableDropdownProps = {
  options: Option[]
  onSelect: (option: Option | null) => void
  initialValue?: Option | null
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  onSelect,
  initialValue,
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState<string>(
    initialValue?.name || ""
  )
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    setHighlightedIndex(null)
  }, [searchQuery, options])

  useEffect(() => {
    if (initialValue) {
      setSearchQuery(initialValue.name)
    } else {
      setSearchQuery("")
    }
  }, [initialValue])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setIsOpen(true)
  }

  const handleOptionClick = (option: Option) => {
    setSearchQuery(option.name)
    setIsOpen(false)
    onSelect(option)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (filteredOptions.length > 0) {
        setHighlightedIndex((prevIndex) =>
          prevIndex === null
            ? 0
            : Math.min(prevIndex + 1, filteredOptions.length - 1)
        )
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (filteredOptions.length > 0) {
        setHighlightedIndex((prevIndex) =>
          prevIndex === null
            ? filteredOptions.length - 1
            : Math.max(prevIndex - 1, 0)
        )
      }
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (highlightedIndex !== null) {
        handleOptionClick(filteredOptions[highlightedIndex])
      }
    }
  }

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <div
      data-testid="searchabledropdown"
      className={styles.dropdownContainer}
      ref={dropdownRef}
    >
      <div className={styles.dropdownInput}>
        <input
          type="text"
          placeholder={`${t("Dropdown.Search")}...`}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onClick={() => {
            setIsOpen(true)
            setSearchQuery("")
          }}
          ref={inputRef}
          aria-label="Dropdown search"
        />
        <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
      </div>
      {isOpen && (
        <ul
          data-testid="dropdownmenulist"
          className={`${styles.dropdownMenu} ${styles.show}`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li key={option.code}>
                <button
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleOptionClick(option)
                    }
                  }}
                  className={highlightedIndex === index ? styles.active : ""}
                >
                  {option.name}
                </button>
              </li>
            ))
          ) : (
            <li>{t("Dropdown.NoOptions")}</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default SearchableDropdown
