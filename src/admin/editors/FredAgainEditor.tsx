import type { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './SectionEditorBase.module.css';

export function FredAgainEditor({ 
  data, 
  setData, 
  onUpload, 
  onUploadBackground, 
  fileRef, 
  backgroundFileRef 
}: SectionEditorProps) {
  return (
    <>
      <FormField label="Heading">
        <TextInput
          value={(typeof data.heading === 'string' ? data.heading : '') || ''}
          onChange={value => setData({ ...data, heading: value })}
          placeholder="Imagine you invested in Fred Again.. in 2020"
        />
      </FormField>

      <FormField label="Subheading">
        <TextInput
          value={(typeof data.subheading === 'string' ? data.subheading : '') || ''}
          onChange={value => setData({ ...data, subheading: value })}
          placeholder="Braggin' rights now come with returns"
        />
      </FormField>

      <FormField label="Background Image URL">
        <TextInput
          value={(typeof data.backgroundImage === 'string' ? data.backgroundImage : '') || ''}
          onChange={value => setData({ ...data, backgroundImage: value })}
          placeholder="https://..."
        />
        {onUploadBackground && backgroundFileRef && (
          <ImageUpload
            onUpload={onUploadBackground}
            fileRef={backgroundFileRef}
            previewUrl={typeof data.backgroundImage === 'string' ? data.backgroundImage : undefined}
          />
        )}
      </FormField>

      <FormField label="Background Image SrcSet (optional)">
        <TextAreaInput
          value={(typeof data.backgroundImageSrcSet === 'string' ? data.backgroundImageSrcSet : '') || ''}
          onChange={value => setData({ ...data, backgroundImageSrcSet: value })}
          rows={3}
          placeholder="image-500.jpg 500w, image-800.jpg 800w, ..."
        />
      </FormField>

      <FormField label="Logo URLs">
        {onUpload && fileRef && (
          <ImageUpload
            onUpload={onUpload}
            fileRef={fileRef}
            hint="Upload logo image"
          />
        )}
        <ul className={styles.list}>
          {(Array.isArray(data.logoUrls) ? data.logoUrls : []).map((logoUrl: unknown, idx: number) => {
            const url = typeof logoUrl === 'string' ? logoUrl : '';
            const logoUrls = Array.isArray(data.logoUrls) ? data.logoUrls : [];
            return (
            <li key={idx} className={styles.listItem}>
              <img 
                src={url} 
                alt={`Logo ${idx + 1}`} 
                className={styles.listImage}
              />
              <TextInput
                value={url}
                onChange={value => {
                  const next = [...logoUrls];
                  next[idx] = value;
                  setData({ ...data, logoUrls: next });
                }}
                className={styles.listInput}
              />
              <button 
                onClick={() => {
                  const next = logoUrls.filter((_: unknown, i: number) => i !== idx);
                  setData({ ...data, logoUrls: next });
                }}
                className={styles.removeButton}
              >
                Remove
              </button>
            </li>
            );
          })}
        </ul>
      </FormField>
    </>
  );
}

