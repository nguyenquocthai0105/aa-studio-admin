import styles from "./Input.module.css";

function Input({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  rightIcon,
  ...props
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <div
        className={`${styles.inputWrapper} ${
          error ? styles.errorBorder : ""
        }`}
      >
        {icon && <div className={styles.leftIcon}>{icon}</div>}

        <input
          id={id}
          className={styles.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          {...props}
        />

        {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default Input;
