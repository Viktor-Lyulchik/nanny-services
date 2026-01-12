import type { Metadata } from 'next';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Nanny Services - Easy seeking babysitters Online',
  description: 'Find a trusted nanny for your child.',
  openGraph: {
    type: 'website',
    title: 'Nanny Services - Easy seeking babysitters Online',
    description: 'Find a trusted nanny for your child.',
    url: 'https://nanny-services-mocha.vercel.app/',
    siteName: 'Nanny Services',
    images: [
      {
        url: 'https://nanny-services-mocha.vercel.app/hero.png',
        width: 1200,
        height: 630,
        alt: 'Nanny Services - Easy seeking babysitters Online',
      },
    ],
  },
  twitter: {
    title: 'Nanny Services - Easy seeking babysitters Online',
    description: 'Find a trusted nanny for your child.',
    images: ['https://nanny-services-mocha.vercel.app/hero.png'],
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.titleNF}>404 - Page not found</h1>
      <p className={css.descriptionNF}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
