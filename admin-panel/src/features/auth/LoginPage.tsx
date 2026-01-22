import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "./authSlice";
import { Spinner } from "@task-approval/shared-ui";
import styles from "./LoginPage.module.scss";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <h2>Admin Panel</h2>
        <p className={styles.subtitle}>Hesabınıza giriş yapın</p>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@email.com"
            />
          </div>
          <div className={styles["form-group"]}>
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <div className={styles["error-alert"]}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={styles["submit-btn"]}
          >
            {loading && <Spinner />}
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
