import HeaderMenu from '../HeaderMenu/HeaderMenu';
import clsx from 'clsx';
import styles from './Header.module.css';

type HeaderProps = { type?: 'default' | 'overlay' };

export default function Header({ type = 'default' }: HeaderProps) {
  return (
    <header
      className={clsx(
        styles.header,
        type === 'default' && styles.default,
        type === 'overlay' && styles.overlay
      )}
    >
      <div
        className={clsx(
          type === 'default' && 'container',
          type === 'overlay' && styles.overlayContainer
        )}
      >
        <HeaderMenu />
      </div>
    </header>
  );
}
