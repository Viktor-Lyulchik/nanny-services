import Header from '@/components/Header/Header';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Header type="overlay" />

      <main>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.card}>
              <div className={styles.content}>
                <h1 className={styles.title}>
                  Make Life Easier for the Family:
                </h1>

                <p className={styles.description}>
                  Find Babysitters Online for All Occasions
                </p>

                <Link href="/nannies" className={styles.button}>
                  Get started
                  <ArrowUpRight
                    size={24}
                    color="#fbfbfb"
                    className={styles.icon}
                  />
                </Link>
              </div>

              <div className={styles.image}>
                <div className={styles.badge}>
                  <div className={styles.badgeIcon}>
                    <Check size={20} color="white" />
                  </div>

                  <div>
                    <p className={styles.badgeLabel}>Experienced nannies</p>
                    <p className={styles.badgeValue}>15,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
