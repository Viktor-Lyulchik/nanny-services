'use client';

import { useState } from 'react';
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  FieldPath,
} from 'react-hook-form';
import styles from './AuthRHFInputs.module.css';

type AuthRHFInputsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export function AuthRHFInputs<T extends FieldValues>({
  register,
  errors,
}: AuthRHFInputsProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className={styles.fieldContainer}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          {...register('email' as FieldPath<T>)}
        />
        {errors.email?.message && (
          <p className={styles.errorMessage}>
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div className={styles.passwordContainer}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className={`${styles.input} ${styles.passwordInput}`}
          {...register('password' as FieldPath<T>)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className={styles.toggleButton}
          aria-label="Toggle password visibility"
        >
          <svg width="24" height="24">
            <use
              href={
                showPassword
                  ? '/img/icons.svg#icon-eye-invisible'
                  : '/img/icons.svg#icon-eye'
              }
              fill="#fff"
              stroke="#11101c"
            />
          </svg>
        </button>
        {errors.password?.message && (
          <p className={styles.errorMessage}>
            {errors.password.message as string}
          </p>
        )}
      </div>
    </>
  );
}
