'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { AppointmentFormData, Nanny } from '@/types/nanny';
import { appointmentSchema } from '@/validation/validation';
import styles from './Appointment.module.css';

interface AppointmentProps {
  nanny: Nanny;
  onClose: () => void;
}

export default function Appointment({ nanny, onClose }: AppointmentProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: yupResolver(appointmentSchema),
  });

  // Block body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Prevent scroll on backdrop (especially for mobile)
  useEffect(() => {
    const backdrop = document.querySelector(
      `.${styles.backdrop}`
    ) as HTMLElement;

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as Node;

      // if scroll happens on backdrop (not inside modal)
      if (backdrop && backdrop === target) {
        e.preventDefault();
        return;
      }

      // if scroll happens outside modal
      if (modalRef.current && !modalRef.current.contains(target)) {
        e.preventDefault();
        return;
      }

      // if scroll happens inside modal - check if scrolling is possible
      if (modalRef.current && modalRef.current.contains(target)) {
        const modal = modalRef.current;
        const { scrollTop, scrollHeight, clientHeight } = modal;

        // For wheel events
        if (e instanceof WheelEvent) {
          const isScrollingDown = e.deltaY > 0;
          const isScrollingUp = e.deltaY < 0;

          // Block scroll if reached modal boundaries
          if (
            (isScrollingDown && scrollTop + clientHeight >= scrollHeight) ||
            (isScrollingUp && scrollTop <= 0)
          ) {
            e.preventDefault();
          }
        }
      }
    };

    if (backdrop) {
      backdrop.addEventListener('wheel', preventScroll, { passive: false });
      backdrop.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      if (backdrop) {
        backdrop.removeEventListener('wheel', preventScroll);
        backdrop.removeEventListener('touchmove', preventScroll);
      }
    };
  }, []);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      toast.success('Appointment request sent!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} ref={modalRef}>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>

        <h2 className={styles.title}>Make an appointment with a babysitter</h2>

        <p className={styles.description}>
          Arranging a meeting with a caregiver for your child is the first step
          to creating a safe and comfortable environment. Fill out the form
          below so we can match you with the perfect care partner.
        </p>

        <div className={styles.nannyInfo}>
          <Image
            src={nanny.avatar_url}
            alt={nanny.name}
            width={44}
            height={44}
            className={styles.nannyAvatar}
          />
          <div>
            <p className={styles.nannyLabel}>Your nanny</p>
            <p className={styles.nannyName}>{nanny.name}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <div className={styles.inputWrapper}>
                <input
                  {...register('address')}
                  type="text"
                  placeholder="Address"
                  className={styles.input}
                />
                {errors.address && (
                  <p className={styles.error}>{errors.address.message}</p>
                )}
              </div>
            </div>
            <div className={styles.formField}>
              <div className={styles.inputWrapper}>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+380"
                  className={styles.input}
                />
                {errors.phone && (
                  <p className={styles.error}>{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <div className={styles.inputWrapper}>
                <input
                  {...register('childAge')}
                  type="text"
                  placeholder="Child's age"
                  className={styles.input}
                />
                {errors.childAge && (
                  <p className={styles.error}>{errors.childAge.message}</p>
                )}
              </div>
            </div>
            <div className={styles.formField}>
              <div className={styles.inputWrapper}>
                <input
                  {...register('time')}
                  type="time"
                  className={styles.input}
                  defaultValue="12:00"
                  step={1800}
                />
                {errors.time && (
                  <p className={styles.error}>{errors.time.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <input
              {...register('parentName')}
              type="text"
              placeholder="Father's or mother's name"
              className={styles.input}
            />
            {errors.parentName && (
              <p className={styles.error}>{errors.parentName.message}</p>
            )}
          </div>

          <div className={styles.textareaWrapper}>
            <textarea
              {...register('comment')}
              placeholder="Comment"
              className={styles.textarea}
            />
            {errors.comment && (
              <p className={styles.error}>{errors.comment.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={clsx('blue-button', styles.appointmentButton)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
