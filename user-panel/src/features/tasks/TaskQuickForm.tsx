import React from "react";
import { useForm } from "react-hook-form";
import styles from "./DashboardPage.module.scss";

export type TaskFormInputs = {
  title: string;
  description: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: string;
};

const priorities = [
  { value: "low", label: "Düşük" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Yüksek" },
  { value: "urgent", label: "Acil" },
];

const categories = [
  "Teknik Destek",
  "İzin Talebi",
  "Satın Alma",
  "Diğer"
];

interface Props {
  onSubmit: (data: TaskFormInputs) => void;
  loading?: boolean;
  success?: boolean;
  error?: string | null;
}

const TaskQuickForm: React.FC<Props> = ({ onSubmit, loading, success, error }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({ defaultValues: { priority: "normal", category: categories[0] } });

  React.useEffect(() => {
    if (success) reset();
  }, [success, reset]);

  return (
    <form className={styles.quickForm} onSubmit={handleSubmit(onSubmit)} style={{
      display: "flex",
      flexDirection: "column",
      gap: 18,
      minWidth: 300,
      maxWidth: 360,
      margin: "0 auto"
    }}>
      <h3 style={{ textAlign: "center", color: "#2d3748", marginBottom: 18, fontWeight: 600, fontSize: 20 }}>Talep Oluştur</h3>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#4a5568", fontWeight: 500 }}>Başlık</label>
        <input
          {...register("title", { required: "Başlık zorunlu" })}
          type="text"
          placeholder="Talep başlığı"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: errors.title ? "1.5px solid #e53e3e" : "1.5px solid #cbd5e1",
            borderRadius: 8,
            fontSize: 16
          }}
        />
        {errors.title && <span className={styles.formError}>{errors.title.message}</span>}
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#4a5568", fontWeight: 500 }}>Açıklama</label>
        <textarea
          {...register("description", { required: "Açıklama zorunlu" })}
          placeholder="Talep açıklaması"
          rows={3}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: errors.description ? "1.5px solid #e53e3e" : "1.5px solid #cbd5e1",
            borderRadius: 8,
            fontSize: 16
          }}
        />
        {errors.description && <span className={styles.formError}>{errors.description.message}</span>}
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#4a5568", fontWeight: 500 }}>Öncelik</label>
        <select
          {...register("priority", { required: true })}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #cbd5e1",
            borderRadius: 8,
            fontSize: 16
          }}
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", marginBottom: 6, color: "#4a5568", fontWeight: 500 }}>Kategori</label>
        <select
          {...register("category", { required: true })}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #cbd5e1",
            borderRadius: 8,
            fontSize: 16
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {error && <div className={styles.formError}>{error}</div>}
      {success && <div className={styles.formSuccess}>Talep başarıyla oluşturuldu!</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#a0aec0" : "#3182ce",
          color: "#fff",
          fontWeight: 600,
          fontSize: 17,
          border: "none",
          borderRadius: 8,
          padding: "12px 0",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        }}
      >
        {loading ? "Kaydediliyor..." : "Talep Oluştur"}
      </button>
    </form>
  );
};

export default TaskQuickForm;
