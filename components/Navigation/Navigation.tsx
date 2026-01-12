'use client';

import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

import styles from './Navigation.module.css';

type NavigationProps = {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
};

export default function Navigation({
  onLoginClick,
  onRegisterClick,
}: NavigationProps) {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isAuthenticated) {
    return (
      <div className={`${styles.root} ${styles.authenticated}`}>
        <div className={styles.userBlock}>
          <div className={styles.avatar}>
            <svg width={24} height={24}>
              <use href="/img/icons.svg#icon-user" fill="#0957c3" />
            </svg>
          </div>

          <span className={styles.userName}>
            {user.displayName || user.email}
          </span>
        </div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${styles.guest}`}>
      <button onClick={onLoginClick} className={styles.loginButton}>
        Log In
      </button>

      <button onClick={onRegisterClick} className={styles.registerButton}>
        Register
      </button>
    </div>
  );
}
