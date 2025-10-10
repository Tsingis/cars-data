import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import styles from "./SearchableDropdown.module.css";

type Option = {
  code: string;
  name: string;
};

type SearchableDropdownProps = {
  options: Option[];
  onSelect: (option: Option | null) => void;
  initialValue?: Option | null;
};

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  onSelect,
  initialValue,
}) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCode, setSelectedCode] = useState<string | null>(
    initialValue?.code ?? null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  useEffect(() => {
    if (selectedCode) {
      const opt = options.find((o) => o.code === selectedCode);
      if (opt) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery(opt.name);
      }
    }
  }, [i18n.language, selectedCode, options]);

  const handleSearchClick = () => {
    setIsOpen(true);
    setSearchQuery("");
    setSelectedCode(null);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedCode(null);
    setIsOpen(true);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filteredOptions.length > 0) {
        setHighlightedIndex((prevIndex) =>
          prevIndex === null
            ? 0
            : Math.min(prevIndex + 1, filteredOptions.length - 1)
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (filteredOptions.length > 0) {
        setHighlightedIndex((prevIndex) =>
          prevIndex === null
            ? filteredOptions.length - 1
            : Math.max(prevIndex - 1, 0)
        );
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex !== null) {
        handleOptionClick(filteredOptions[highlightedIndex]);
      }
    }
  };

  const handleOptionClick = (option: Option) => {
    setSelectedCode(option.code);
    setSearchQuery(option.name);
    setIsOpen(false);
    onSelect(option);
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    option: Option
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleOptionClick(option);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      data-testid="searchabledropdown"
      className={styles.dropdownContainer}
      ref={dropdownRef}
    >
      <div className={styles.dropdownInput}>
        <input
          type="text"
          placeholder={`${t(($) => $.dropdown.search)}...`}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onClick={handleSearchClick}
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
                  onKeyDown={(event) => handleOptionKeyDown(event, option)}
                  className={
                    selectedCode === option.code || highlightedIndex === index
                      ? styles.active
                      : ""
                  }
                >
                  {option.name}
                </button>
              </li>
            ))
          ) : (
            <li>{t(($) => $.dropdown.noOptions)}</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
