'use client';

import { SortOption, Nanny } from '@/types/nanny';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import styles from './Filter.module.css';

type FilterProps = {
  onChange: (option: SortOption) => void;
  nannies?: Nanny[];
  setFilteredNannies?: React.Dispatch<React.SetStateAction<Nanny[]>>;
};

const OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'A to Z', value: 'sort-asc' },
  { label: 'Z to A', value: 'sort-desc' },
  { label: 'Less then $10', value: 'price-less-10' },
  { label: 'Greater then $10', value: 'price-greater-10' },
  { label: 'Popular', value: 'popular' },
  { label: 'Not popular', value: 'unpopular' },
  { label: 'Show All', value: 'all' },
];

export default function Filter({ onChange }: FilterProps) {
  const [selected, setSelected] = useState<SortOption>('sort-asc');
  const [open, setOpen] = useState(false);

  const handleSelect = (option: SortOption) => {
    setSelected(option);
    onChange(option);
    setOpen(false);
  };

  return (
    <>
      <p className={styles.filterLabel}>Filters</p>
      <div className={styles.filterContainer}>
        <button onClick={() => setOpen(!open)} className={styles.filterButton}>
          {OPTIONS.find(f => f.value === selected)?.label}

          {open ? (
            <ChevronUp className={styles.icon} />
          ) : (
            <ChevronDown className={styles.icon} />
          )}
        </button>

        {open && (
          <div className={styles.dropdown}>
            <div>
              {OPTIONS.map(f => (
                <button
                  key={f.value}
                  onClick={() => handleSelect(f.value)}
                  className={`${styles.dropdownItem} ${
                    selected === f.value ? styles.dropdownItemActive : ''
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
