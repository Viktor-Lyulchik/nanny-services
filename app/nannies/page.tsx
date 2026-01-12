'use client';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase/firebase';
import type { Nanny, SortOption } from '@/types/nanny';

import { filterNannies } from '@/utils/filter';
import Loading from '@/app/loading';

import Header from '@/components/Header/Header';
import Filter from '@/components/Filter/Filter';
import List from '@/components/List/List';
import Appointment from '@/components/Appointment/Appointment';

import styles from './page.module.css';

const ITEMS_PER_PAGE = 3;

export default function NanniesPage() {
  const [nannies, setNannies] = useState<Nanny[]>([]);
  const [filteredNannies, setFilteredNannies] = useState<Nanny[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<SortOption>('all');
  const [selectedNanny, setSelectedNanny] = useState<Nanny | null>(null);

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        const dataSnapShot = await get(ref(db, 'nannies'));
        if (!dataSnapShot.exists()) return;

        const data = dataSnapShot.val();
        const list: Nanny[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Nanny, 'id'>),
        }));

        setNannies(list);
      } finally {
        setLoading(false);
      }
    };

    fetchNannies();
  }, []);

  useEffect(() => {
    const list = filterNannies(nannies, currentFilter);
    setFilteredNannies(list.slice(0, visibleCount));
  }, [nannies, currentFilter, visibleCount]);

  const loadMore = () => setVisibleCount(prev => prev + ITEMS_PER_PAGE);

  const handleFilterChange = (option: SortOption) => {
    setCurrentFilter(option);
    setVisibleCount(ITEMS_PER_PAGE); // reset pagination
  };

  // Check if there are more items
  const hasMore =
    filteredNannies.length < filterNannies(nannies, currentFilter).length;

  const handleMakeAppointment = (nanny: Nanny) => {
    setSelectedNanny(nanny);
  };

  return (
    <>
      <Header type="default" />

      <main className={styles.main}>
        <div className="container">
          {loading ? (
            <Loading />
          ) : (
            <>
              <Filter onChange={handleFilterChange} />
              <List
                nannies={filteredNannies}
                onLoadMore={loadMore}
                hasMore={hasMore}
                onMakeAppointment={handleMakeAppointment}
              />
            </>
          )}
          {selectedNanny && (
            <Appointment
              nanny={selectedNanny}
              onClose={() => setSelectedNanny(null)}
            />
          )}
        </div>
      </main>
    </>
  );
}
