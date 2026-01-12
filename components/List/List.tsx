'use client';

import type { Nanny } from '@/types/nanny';
import Card from '@/components/Card/Card';
import styles from './List.module.css';

type ListProps = {
  nannies: Nanny[];
  onLoadMore: () => void;
  hasMore: boolean;
  onMakeAppointment: (nanny: Nanny) => void;
};

export default function List({
  nannies,
  onLoadMore,
  hasMore,
  onMakeAppointment,
}: ListProps) {
  return (
    <>
      {nannies.length > 0 ? (
        <ul className={styles.list}>
          {nannies.map(nanny => (
            <li key={nanny.id}>
              <Card nanny={nanny} onMakeAppointment={onMakeAppointment} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>No nannies found for this filter.</p>
      )}

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button onClick={onLoadMore} className={styles.loadMoreButton}>
            Load more
          </button>
        </div>
      )}
    </>
  );
}
