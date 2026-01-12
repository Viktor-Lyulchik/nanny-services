import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FirebaseError } from 'firebase/app';
import { AuthRHFInputs } from '../AuthRHFInputs/AuthRHFInputs';
import { regSchema } from '@/validation/validation';
import styles from './RegisterForm.module.css';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type Props = {
  onClose: () => void;
};

export default function RegisterModal({ onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(regSchema),
  });

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

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

  const onSubmit = async (data: FormValues) => {
    setAuthError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      onClose();
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setAuthError('This email is already in use');
            break;
          case 'auth/weak-password':
            setAuthError('Password is too simple');
            break;
          default:
            setAuthError('Something went wrong. Try again later.');
        }
      } else {
        setAuthError('Something went wrong. Try again later.');
      }
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close modal form"
        >
          ✕
        </button>

        <h2 className={styles.title}>Registration</h2>
        <p className={styles.description}>
          Thank you for your interest in our platform! In order to register, we
          need some information. Please provide us with the following
          information.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Name"
              className={styles.input}
              {...register('name')}
            />
            {errors.name?.message && (
              <p className={styles.errorText}>
                {errors.name.message as string}
              </p>
            )}
          </div>
          <AuthRHFInputs register={register} errors={errors} />
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
          <div className={styles.errorContainer}>
            {authError && <p className={styles.errorText}>{authError}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
