import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import Button from "../../components/common/Button/Button";
import Card from "../../components/common/Card/Card";
import Input from "../../components/common/Input/Input";
import Logo from "../../components/common/Logo/Logo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosClient from "../../services/api";

import styles from "./Login.module.css";

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 10V7.5C8 5.01472 10.0147 3 12.5 3C14.9853 3 17 5.01472 17 7.5V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="10"
        width="15"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12C3.8 8.5 7.2 6 12 6C16.8 6 20.2 8.5 22 12C20.2 15.5 16.8 18 12 18C7.2 18 3.8 15.5 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 6.2C11.05 6.07 11.51 6 12 6C16.8 6 20.2 8.5 22 12C21.2 13.56 20.1 14.9 18.7 15.95"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.12 14.12C13.58 14.66 12.83 15 12 15C10.34 15 9 13.66 9 12C9 11.17 9.34 10.42 9.88 9.88"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.1 6.1C4.37 7.28 3.03 8.97 2 12C3.8 15.5 7.2 18 12 18C13.57 18 14.98 17.73 16.23 17.24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    if (!username.trim()) nextErrors.username = "Vui lòng nhập tên tài khoản";
    if (!password.trim()) nextErrors.password = "Vui lòng nhập mật khẩu";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Gọi qua axiosClient, đường dẫn chỉ cần ghi phần đuôi phía sau "/api"
      const response = await axiosClient.post("/auth/login", {
        username,
        password,
      });

      if (response.data.success) {
        console.log("Đăng nhập admin thành công!", { username, remember });
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ auth: error.response.data.message });
      } else {
        setErrors({ auth: "Không thể kết nối tới máy chủ Backend!" });
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.ambientOne}></div>
      <div className={styles.ambientTwo}></div>

      <div className={styles.card}>
        {/* BÊN TRÁI: SHOWCASE */}
        <div className={styles.showcase}>
          <div className={styles.logoWrapper}>
            <Logo />
          </div>
          <div className={styles.badge}>HỆ THỐNG QUẢN TRỊ NỘI BỘ</div>
          <h1 className={styles.heroTitle}>
            Á À Studio
            <span>Art & Creative</span>
          </h1>
          <p className={styles.heroText}>
            Chào mừng bạn trở lại không gian sáng tạo. Hệ thống quản lý toàn
            diện lịch chụp, khách hàng và quy trình hậu kỳ của Á À Studio.
          </p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <CheckIcon />
              </span>
              <span>Lưu giữ và điều phối khoảnh khắc</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <CheckIcon />
              </span>
              <span>Tối ưu quy trình vận hành Studio</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <CheckIcon />
              </span>
              <span>Bảo mật dữ liệu & hình ảnh khách hàng</span>
            </div>
          </div>
        </div>

        {/* BÊN PHẢI: FORM CĂN CHỈNH */}
        <div className={styles.formPanel}>
          <div className={styles.formTop}>
            <div className={styles.titleGroup}>
              <p className={styles.overline}>STUDIO ADMIN</p>
              <h2>Đăng nhập</h2>
            </div>
            <p className={styles.subText}>
              Vui lòng nhập tài khoản admin để truy cập trang quản trị
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {errors.auth && (
              <div className={styles.errorMessage}>{errors.auth}</div>
            )}

            <Input
              id="username"
              label="Tài khoản"
              type="text"
              placeholder="Nhập tên tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              icon={<UserIcon />}
              autoComplete="username"
            />

            <Input
              id="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<LockIcon />}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <div className={styles.helperRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Ghi nhớ phiên đăng nhập này</span>
              </label>
            </div>

            <Button type="submit" size="lg">
              Vào hệ thống
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
