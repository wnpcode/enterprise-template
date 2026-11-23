import { useId, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Label } from "../Label";

/** Atribut yang harus disebar ke kontrol (Input, Textarea, Select, …) agar label, hint, dan error terhubung. */
export type FormFieldControlProps = {
  id: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

export type FormFieldProps = {
  label: ReactNode;
  /** Default: id otomatis dari `useId`. */
  id?: string;
  required?: boolean;
  hint?: ReactNode;
  /** Bila terisi, kontrol diberi `aria-invalid` dan pesan tampil di bawah hint. */
  error?: ReactNode;
  className?: string;
  children: (control: FormFieldControlProps) => ReactNode;
};

export function FormField({ label, id, required, hint, error, className, children }: FormFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {children({ id: fieldId, required, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
