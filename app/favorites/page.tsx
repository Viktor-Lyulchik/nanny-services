'use client';

import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase/firebase';
import { SortOption } from '@/types/nanny';
import type { Nanny } from '@/types/nanny';
import { filterNannies } from '@/utils/filter';
import Loading from '@/app/loading';
import Card from '@/components/Card/Card';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import Header from '@/components/Header/Header';
import Filter from '@/components/Filter/Filter';
import Appointment from '@/components/Appointment/Appointment';
import styles from './page.module.css';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Nanny[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Nanny[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNanny, setSelectedNanny] = useState<Nanny | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const favSnapShot = await get(ref(db, `users/${user.uid}/favorites`));
        if (!favSnapShot.exists()) {
          setFavorites([]);
          setFilteredFavorites([]);
          return;
        }

        const favoriteIds = Object.keys(favSnapShot.val());
        const nanniesSnapShot = await get(ref(db, 'nannies'));
        if (!nanniesSnapShot.exists()) {
          setFavorites([]);
          setFilteredFavorites([]);
          return;
        }

        const allNannies: Nanny[] = Object.entries(nanniesSnapShot.val()).map(
          ([id, value]) => ({
            id,
            ...(value as Omit<Nanny, 'id'>),
          })
        );

        const favoriteNannies = allNannies.filter(n =>
          favoriteIds.includes(n.id)
        );

        setFavorites(favoriteNannies);
        setFilteredFavorites(favoriteNannies);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = (nannyId: string) => {
    setFavorites(prev => prev.filter(n => n.id !== nannyId));
    setFilteredFavorites(prev => prev.filter(n => n.id !== nannyId));
  };

  const handleFilterChange = (option: SortOption) => {
    setFilteredFavorites(filterNannies(favorites, option));
  };

  return (
    <>
      <Header type="default" />

      <main className={styles.main}>
        <div className="container">
          <Filter onChange={handleFilterChange} />

          {loading ? (
            <Loading />
          ) : filteredFavorites.length > 0 ? (
            filteredFavorites.map(nanny => (
              <Card
                key={nanny.id}
                nanny={nanny}
                onRemoveFavorite={handleRemoveFavorite}
                onMakeAppointment={n => setSelectedNanny(n)}
              />
            ))
          ) : (
            <p className={styles.empty}>No favorite nannies yet.</p>
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
