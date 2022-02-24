import styles from "../styles/Error.module.css";

export function Error({errorText, errorIcon}) {
  return (
    <div className={styles.errorContainer}>
      <i className={`${errorIcon} ${styles.errorImg}`}></i>
      <p className={styles.errorText}>{errorText}</p>
    </div>
  )
}
