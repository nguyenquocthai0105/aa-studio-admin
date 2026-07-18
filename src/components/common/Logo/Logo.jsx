import Logo from "../../../assets/images/Logo.png";
import styles from "./Logo.module.css";

function Logo() {
    return (
        <div className={styles.logo}>
            <img src={logo} alt="Á À Studio" />
        </div>
    );
}

export default Logo;