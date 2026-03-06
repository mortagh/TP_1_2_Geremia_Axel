import { useState, useEffect } from "react";
import { createUser, updateUser, type User } from "../services/userService";
import { Input } from "./ui/Input/Input";
import { Select } from "./ui/Select/Select";
import { Button } from "./ui/Button/Button";

interface UserFormProps {
  userToEdit?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({
  userToEdit,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (userToEdit) {
        await updateUser(userToEdit._id, { name, email, role });
      } else {
        await createUser({ name, email, role });
        setSuccessMsg("Recrue enrôlée avec succès !");
        setTimeout(() => setSuccessMsg(null), 2000);
      }

      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "2px dashed var(--wow-border-thin)",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ textAlign: "center", margin: "0 0 20px 0" }}>
        {userToEdit
          ? "✒️ Modifier la missive"
          : "📜 Enrôler une nouvelle recrue"}
      </h3>

      {error && (
        <p style={{ color: "var(--wow-error)", fontWeight: "bold" }}>{error}</p>
      )}

      <div style={{ marginBottom: "15px" }}>
        <Input
          placeholder="Nom du Héros"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <Input
          type="email"
          placeholder="Email magique"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "admin")}
          options={[
            { value: "user", label: "Soldat (User)" },
            { value: "admin", label: "Général (Admin)" },
          ]}
        />
      </div>
      {successMsg && (
        <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>
          {successMsg}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          type="button"
          onClick={onCancel}
          style={{ backgroundColor: "#333" }}
        >
          Annuler
        </Button>
        <Button type="submit">
          {userToEdit ? "Mettre à jour" : "Recruter"}
        </Button>
      </div>
    </form>
  );
}
