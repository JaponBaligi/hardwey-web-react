import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './SharesEditor.module.css';

export function SharesEditor({ 
  data, 
  setData, 
  onUploadBackground, 
  backgroundFileRef 
}: SectionEditorProps) {
  return (
    <>
      <FormField label="Heading">
        <TextInput
          value={data.heading || ''}
          onChange={value => setData({ ...data, heading: value })}
          placeholder="Buy shares in artists' brands"
        />
      </FormField>

      <FormField label="Subheading (Mobile)">
        <TextInput
          value={data.subheadingMobile || ''}
          onChange={value => setData({ ...data, subheadingMobile: value })}
          placeholder="A new way to invest"
        />
      </FormField>

      <div className={styles.field}>
        <FormField label="Subheading Words (Desktop - separate by commas)">
          <TextInput
            value={(data.subheadingWords || []).join(', ')}
            onChange={value => {
              const words = value.split(',').map(w => w.trim()).filter(w => w);
              setData({ ...data, subheadingWords: words });
            }}
            placeholder="A new way, to, Invest"
          />
        </FormField>
        <span className={styles.helperText}>Comma-separated words for desktop animation</span>
      </div>

      <FormField label="Body Copy">
        <TextAreaInput
          value={data.bodyCopy || ''}
          onChange={value => setData({ ...data, bodyCopy: value })}
          rows={4}
          placeholder="Artists build brands that generate revenue..."
        />
      </FormField>

      <FormField label="Image URL">
        <TextInput
          value={data.imageUrl || ''}
          onChange={value => setData({ ...data, imageUrl: value })}
          placeholder="/assets/img/BUY%20SHARES%20IMAGE.jpg"
        />
        <ImageUpload
          onUpload={onUploadBackground!}
          fileRef={backgroundFileRef}
          hint="Or upload an image"
          previewUrl={data.imageUrl}
        />
      </FormField>

      <FormField label="Image SrcSet (optional)">
        <TextAreaInput
          value={data.imageSrcSet || ''}
          onChange={value => setData({ ...data, imageSrcSet: value })}
          rows={2}
          placeholder="/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, ..."
          className={styles.srcSetInput}
        />
      </FormField>
    </>
  );
}

