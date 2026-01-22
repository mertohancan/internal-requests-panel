import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createTask } from "@/features/tasks/tasksSlice";
import { useNavigate } from "react-router-dom";
import styles from "./TaskFormPage.module.scss";

const schema = z.object({
  title: z.string().min(3, "Başlık zorunlu ve en az 3 karakter olmalı."),
  description: z
    .string()
    .min(5, "Açıklama zorunlu ve en az 5 karakter olmalı."),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  category: z.enum(["Teknik Destek", "İzin Talebi", "Satın Alma", "Diğer"]),
});

type FormValues = z.infer<typeof schema>;

const TaskFormPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: "normal",
      category: "Teknik Destek",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    try {
      await dispatch(createTask({ ...data, createdBy: user.id })).unwrap();
      reset();
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Error handled by Redux state
    }
  };

  return (
    <div className={styles["task-form-container"]}>
      <div className={styles["page-header"]}>
        <h2>Yeni Talep Oluştur</h2>
        <p className={styles.subtitle}>
          Lütfen talep detaylarını eksiksiz doldurun
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["form-group"]}>
          <label>Başlık *</label>
          <input
            {...register("title")}
            placeholder="Talep başlığını girin"
            className={errors.title ? styles.error : ""}
          />
          {errors.title && (
            <span className={styles["error-message"]}>
              {errors.title.message}
            </span>
          )}
        </div>

        <div className={styles["form-group"]}>
          <label>Açıklama *</label>
          <textarea
            {...register("description")}
            placeholder="Talep detaylarını açıklayın..."
            className={errors.description ? styles.error : ""}
          />
          {errors.description && (
            <span className={styles["error-message"]}>
              {errors.description.message}
            </span>
          )}
          <span className={styles.hint}>
            Talebin detaylı açıklamasını yazın (en az 5 karakter)
          </span>
        </div>

        <div className={styles["form-group"]}>
          <label>Öncelik *</label>
          <select {...register("priority")}>
            <option value="low">Düşük</option>
            <option value="normal">Normal</option>
            <option value="high">Yüksek</option>
            <option value="urgent">Acil</option>
          </select>
          <span className={styles.hint}>Talebin aciliyet derecesini seçin</span>
        </div>

        <div className={styles["form-group"]}>
          <label>Kategori *</label>
          <select {...register("category")}>
            <option value="Teknik Destek">Teknik Destek</option>
            <option value="İzin Talebi">İzin Talebi</option>
            <option value="Satın Alma">Satın Alma</option>
            <option value="Diğer">Diğer</option>
          </select>
          <span className={styles.hint}>Talebin kategorisini seçin</span>
        </div>

        <div className={styles["button-group"]}>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            disabled={isSubmitting}
          >
            İptal
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Oluşturuluyor..." : "Talep Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskFormPage;
