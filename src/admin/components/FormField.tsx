import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={`${styles.field} ${className || ''}`}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function TextInput({ value, onChange, placeholder, type = 'text', className }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${styles.input} ${className || ''}`}
    />
  );
}

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextAreaInput({ value, onChange, placeholder, rows = 3, className }: TextAreaInputProps) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${styles.textarea} ${className || ''}`}
    />
  );
}

