import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef?: React.RefObject<HTMLInputElement | null>;
  hint?: string;
  previewUrl?: string;
  className?: string;
}

export function ImageUpload({ 
  onUpload, 
  fileRef, 
  hint = 'Or upload an image',
  previewUrl,
  className 
}: ImageUploadProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        ref={fileRef}
      />
      <span className={styles.hint}>{hint}</span>
      {previewUrl && (
        <div className={styles.preview}>
          <img src={previewUrl || undefined} alt="Preview" />
        </div>
      )}
    </div>
  );
}

