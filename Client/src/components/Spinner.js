import styles from "../styles/Spinner.module.css";

export function Spinner() {
    return <i className={`fa-solid fa-spinner ${styles.spinner} ${styles.spinnerAnimation}`}></i>
}
