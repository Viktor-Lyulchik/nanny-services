import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FirebaseError } from 'firebase/app';
import { AuthRHFInputs } from '../AuthRHFInputs/AuthRHFInputs';
import { loginSchema } from '@/validation/validation';
import styles from './LoginModal.module.css';

type FormValues = {
  email: string;
  password: string;
};

type Props = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      onClose();
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          setAuthError('Invalid email or password');
        } else {
          setAuthError('Something went wrong. Try again later.');
        }
      } else if (err instanceof Error) {
        setAuthError(err.message);
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

        <h2 className={styles.title}>Log In</h2>
        <p className={styles.description}>
          Welcome back! Please enter your credentials to access your account and
          continue your babysitter search.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AuthRHFInputs register={register} errors={errors} />
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
          <div className={styles.errorContainer}>
            {authError && <p className={styles.errorText}>{authError}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
