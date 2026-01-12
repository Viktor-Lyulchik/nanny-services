'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { ref, get, set } from 'firebase/database';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { db } from '@/lib/firebase/firebase';
import type { Nanny, Review } from '@/types/nanny';
import { FaStar } from 'react-icons/fa';
import { Heart, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './Card.module.css';

interface CardProps {
  nanny: Nanny;
  onRemoveFavorite?: (nannyId: string) => void;
  onMakeAppointment: (nanny: Nanny) => void;
}

export default function Card({
  nanny,
  onRemoveFavorite,
  onMakeAppointment,
}: CardProps) {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user) return;
    const favoriteRef = ref(db, `users/${user.uid}/favorites/${nanny.id}`);
    get(favoriteRef).then(snapshot => setIsFavorite(snapshot.exists()));
  }, [user, nanny.id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('For authorized users only!');
      return;
    }
    const favoriteRef = ref(db, `users/${user.uid}/favorites/${nanny.id}`);
    const newValue = !isFavorite;
    await set(favoriteRef, newValue ? true : null);
    setIsFavorite(newValue);

    if (!newValue && onRemoveFavorite) {
      onRemoveFavorite(nanny.id);
    }
  };

  const calcAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthes = today.getMonth() - birthDate.getMonth();
    if (
      monthes < 0 ||
      (monthes === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <span className={styles.statusIndicator}></span>
        <Image
          src={nanny.avatar_url}
          alt={nanny.name}
          width={96}
          height={96}
          className={styles.avatar}
        />
      </div>

      {/* Info section */}
      <div className={styles.infoSection}>
        <div className={styles.topRow}>
          <div className={styles.topRowInner}>
            <p className={styles.nannyLabel}>Nanny</p>
            <div className={styles.metaInfo}>
              {/* Location */}
              <div className={styles.metaItem}>
                <MapPin size={16} className={styles.icon} />
                <p className={styles.metaText}>{nanny.location}</p>
              </div>
              <div className={styles.divider}></div>

              {/* Rate */}
              <p className={styles.rating}>
                <FaStar size={15} color="#ffc531" />
                {nanny.rating}
              </p>
              <div className={styles.divider}></div>

              {/* Price */}
              <p className={styles.metaText}>
                Price / 1 hour:{' '}
                <span className={styles.price}>{nanny.price_per_hour}$</span>
              </p>
            </div>
          </div>

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            aria-label="Add to favorites"
            className={styles.favoriteButton}
          >
            <Heart
              size={24}
              strokeWidth={2}
              className={styles.heartIcon}
              {...(isFavorite
                ? { fill: '#0957c3', stroke: '#0957c3' }
                : { fill: 'none', stroke: '#11101c' })}
            />
          </button>
        </div>

        {/* Nanny's name */}
        <h3 className={styles.nannyName}>{nanny.name}</h3>

        {/* Characteristics */}
        <div className={styles.characteristics}>
          <div className={styles.characteristicTag}>
            Age:{' '}
            <span className={styles.characteristicValue}>
              {calcAge(nanny.birthday)}
            </span>
          </div>
          <div className={styles.characteristicTag}>
            Experience:{' '}
            <span className={styles.characteristicValuePlain}>
              {nanny.experience}
            </span>
          </div>
          <div className={styles.characteristicTag}>
            Kids age:{' '}
            <span className={styles.characteristicValuePlain}>
              {nanny.kids_age}
            </span>
          </div>
          <div className={styles.characteristicTag}>
            Characters:{' '}
            <span className={styles.characteristicValuePlain}>
              {nanny.characters?.length ? nanny.characters.join(', ') : 'N/A'}
            </span>
          </div>
          <div className={styles.characteristicTag}>
            Education:{' '}
            <span className={styles.characteristicValuePlain}>
              {nanny.education}
            </span>
          </div>
        </div>

        <p className={styles.about}>{nanny.about}</p>

        {/* Read more / reviews section */}
        <div className={styles.detailsSection}>
          {!showDetails && nanny.reviews?.length ? (
            <button
              onClick={() => setShowDetails(true)}
              className={styles.readMoreButton}
            >
              Read more
            </button>
          ) : null}

          <div
            className={`${styles.detailsContent} ${
              showDetails ? styles.detailsContentVisible : ''
            }`}
          >
            {nanny.reviews?.length ? (
              nanny.reviews.map((review: Review, index: number) => (
                <div key={index} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerAvatar}>
                      {review.reviewer.slice(0, 1)}
                    </div>
                    <div>
                      <p className={styles.reviewerName}>{review.reviewer}</p>
                      <p className={styles.reviewRating}>
                        <FaStar size={15} color="#ffc531" />
                        {review.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>No reviews yet.</p>
            )}

            <button
              onClick={() => onMakeAppointment(nanny)}
              className={clsx('blue-button', styles.appointmentButton)}
            >
              Make an appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
