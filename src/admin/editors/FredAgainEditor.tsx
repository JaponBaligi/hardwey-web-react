import { SectionEditorProps } from './types';
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
          value={data.heading || ''}
          onChange={value => setData({ ...data, heading: value })}
          placeholder="Imagine you invested in Fred Again.. in 2020"
        />
      </FormField>

      <FormField label="Subheading">
        <TextInput
          value={data.subheading || ''}
          onChange={value => setData({ ...data, subheading: value })}
          placeholder="Braggin' rights now come with returns"
        />
      </FormField>

      <FormField label="Background Image URL">
        <TextInput
          value={data.backgroundImage || ''}
          onChange={value => setData({ ...data, backgroundImage: value })}
          placeholder="https://..."
        />
        {onUploadBackground && backgroundFileRef && (
          <ImageUpload
            onUpload={onUploadBackground}
            fileRef={backgroundFileRef}
            previewUrl={data.backgroundImage}
          />
        )}
      </FormField>

      <FormField label="Background Image SrcSet (optional)">
        <TextAreaInput
          value={data.backgroundImageSrcSet || ''}
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
          {(data.logoUrls || []).map((logoUrl: string, idx: number) => (
            <li key={idx} className={styles.listItem}>
              <img 
                src={logoUrl} 
                alt={`Logo ${idx + 1}`} 
                className={styles.listImage}
              />
              <TextInput
                value={logoUrl}
                onChange={value => {
                  const next = [...(data.logoUrls || [])];
                  next[idx] = value;
                  setData({ ...data, logoUrls: next });
                }}
                className={styles.listInput}
              />
              <button 
                onClick={() => {
                  const next = (data.logoUrls || []).filter((_: any, i: number) => i !== idx);
                  setData({ ...data, logoUrls: next });
                }}
                className={styles.removeButton}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </FormField>
    </>
  );
}

