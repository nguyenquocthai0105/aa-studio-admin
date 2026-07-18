import logoImg from "../../../assets/images/Logo.png"; // Đổi tên biến import thành logoImg để không trùng với tên hàm
import styles from "./Logo.module.css";

function Logo() {
    return (
        <div className={styles.logo}>
            <img src={logoImg} alt="Á À Studio" />
        </div>
    );
}

export default Logo;