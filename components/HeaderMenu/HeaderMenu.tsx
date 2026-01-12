'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { useAuth } from '@/components/AuthProvider/AuthProvider';
import LoginModal from '@/components/LoginForm/LoginModal';
import RegisterModal from '../RegisterForm/RegisterForm';
import Navigation from '../Navigation/Navigation';

import styles from './HeaderMenu.module.css';

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [LoginIsOpen, setLoginIsOpen] = useState(false);
  const [RegisterIsOpen, setRegisterIsOpen] = useState(false);

  const { user } = useAuth();
  const isAuthenticated = !!user;
  const pathname = usePathname();

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <Link href="/">
          <svg width={164} height={28}>
            <use href="/img/icons.svg#icon-logo" fill="#fbfbfb" />
          </svg>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <Link
            href="/"
            className={clsx(styles.navLink, pathname === '/' && styles.active)}
          >
            Home
          </Link>

          <Link
            href="/nannies"
            className={clsx(
              styles.navLink,
              pathname === '/nannies' && styles.active
            )}
          >
            Nannies
          </Link>

          {isAuthenticated && (
            <Link
              href="/favorites"
              className={clsx(
                styles.navLink,
                pathname === '/favorites' && styles.active
              )}
            >
              Favorites
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className={styles.authDesktop}>
          <Navigation
            onLoginClick={() => setLoginIsOpen(true)}
            onRegisterClick={() => setRegisterIsOpen(true)}
          />
        </div>

        {/* Mobile burger */}
        <button
          className={styles.burger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={styles.burgerIcon} />
          ) : (
            <Menu className={styles.burgerIcon} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={clsx(styles.mobileMenu, isOpen && styles.mobileMenuOpen)}>
        <div className={styles.mobileContent}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <svg width={164} height={28}>
              <use href="/img/icons.svg#icon-logo" fill="#fbfbfb" />
            </svg>
          </Link>

          {/* nav */}
          <nav className={styles.mobileNav}>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={styles.mobileLink}
            >
              Home
            </Link>

            <Link
              href="/nannies"
              onClick={() => setIsOpen(false)}
              className={styles.mobileLink}
            >
              Nannies
            </Link>

            {isAuthenticated && (
              <Link
                href="/favorites"
                onClick={() => setIsOpen(false)}
                className={styles.mobileLink}
              >
                Favorites
              </Link>
            )}
          </nav>

          {/* auth */}
          <div className={styles.mobileAuth}>
            <Navigation
              onLoginClick={() => {
                setLoginIsOpen(true);
                setIsOpen(false);
              }}
              onRegisterClick={() => {
                setRegisterIsOpen(true);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      {LoginIsOpen && <LoginModal onClose={() => setLoginIsOpen(false)} />}
      {RegisterIsOpen && (
        <RegisterModal onClose={() => setRegisterIsOpen(false)} />
      )}
    </div>
  );
}
