import { SectionEditorProps } from './types';
import { FormField, TextInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './InvestmentEditor.module.css';

export function InvestmentEditor({ 
  data, 
  setData, 
  onUploadBackground, 
  backgroundFileRef,
  onUploadLogo,
  logoFileRef
}: SectionEditorProps) {
  return (
    <>
      <FormField label="Background Image URL">
        <TextInput
          value={data.backgroundImage || ''}
          onChange={value => setData({ ...data, backgroundImage: value })}
          placeholder="/assets/img/BUY SHARES IMAGE.jpg"
        />
        <ImageUpload
          onUpload={onUploadBackground!}
          fileRef={backgroundFileRef}
          hint="Or upload an image"
          previewUrl={data.backgroundImage}
        />
      </FormField>

      <FormField label="Main Heading">
        <TextInput
          value={data.mainHeading || ''}
          onChange={value => setData({ ...data, mainHeading: value })}
          placeholder="invest in artists"
        />
      </FormField>

      <div className={styles.field}>
        <FormField label="Animated Words (comma-separated)">
          <TextInput
            value={Array.isArray(data.animatedWords) ? data.animatedWords.join(', ') : ''}
            onChange={value => setData({ ...data, animatedWords: value.split(',').map(w => w.trim()).filter(w => w) })}
            placeholder="it, hits, different"
          />
        </FormField>
        <span className={styles.helperText}>Words will be displayed in sequence with animation</span>
      </div>

      <FormField label="Coming Soon Title">
        <TextInput
          value={data.comingSoonTitle || ''}
          onChange={value => setData({ ...data, comingSoonTitle: value })}
          placeholder="Coming soon"
        />
      </FormField>

      <FormField label="Date Text">
        <TextInput
          value={data.dateText || ''}
          onChange={value => setData({ ...data, dateText: value })}
          placeholder="(?/?/2026)"
        />
      </FormField>

      <FormField label="Logo Image URL">
        <TextInput
          value={data.logoImage || ''}
          onChange={value => setData({ ...data, logoImage: value })}
          placeholder="/assets/img/hardweymainlogo.jpg"
        />
        <ImageUpload
          onUpload={onUploadLogo!}
          fileRef={logoFileRef}
          hint="Or upload an image"
          previewUrl={data.logoImage}
        />
      </FormField>

      <FormField label="Welcome Text">
        <TextInput
          value={data.welcomeText || ''}
          onChange={value => setData({ ...data, welcomeText: value })}
          placeholder="Welcome to HARDWEY"
        />
      </FormField>
    </>
  );
}

