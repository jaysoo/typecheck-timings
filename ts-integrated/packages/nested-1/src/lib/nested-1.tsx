import styles from './nested-1.module.css';

export function Nested1() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Nested1!</h1>
    </div>
  );
}

export default Nested1;
