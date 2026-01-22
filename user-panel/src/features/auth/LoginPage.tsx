import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/features/auth/authSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(login(data));
  };

  return (
    <div className={styles["login-container"]}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["login-form"]}>
        <h2>Çalışan Paneli</h2>
        <p className={styles.subtitle}>Giriş yaparak taleplerinizi yönetin</p>

        <div className={styles["form-group"]}>
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Zorunlu alan",
              pattern: {
                value: /.+@.+\..+/,
                message: "Geçerli bir email girin",
              },
            })}
            className={errors.email ? styles.error : ""}
            autoComplete="username"
          />
          {errors.email && (
            <span className={styles["error-message"]}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={styles["form-group"]}>
          <label>Şifre</label>
          <input
            type="password"
            {...register("password", {
              required: "Zorunlu alan",
              minLength: { value: 6, message: "En az 6 karakter olmalıdır." },
            })}
            className={errors.password ? styles.error : ""}
            autoComplete="current-password"
          />
          {errors.password && (
            <span className={styles["error-message"]}>
              {errors.password.message}
            </span>
          )}
        </div>

        {error && <div className={styles["error-alert"]}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={styles["submit-btn"]}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
