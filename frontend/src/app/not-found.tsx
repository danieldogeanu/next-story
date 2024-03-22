import styles from '@/styles/not-found.module.scss';

export default function NotFound() {
  return (
    <main className={styles.root}>
      <div>
        <h1 className={styles.errorType}>404</h1>
        <h2 className={styles.errorText}>This page could not be found.</h2>
      </div>
    </main>
  );
}
