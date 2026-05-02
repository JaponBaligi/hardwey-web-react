import type { SectionEditorProps } from './types';
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
          value={(data.backgroundImage as string) || ''}
          onChange={value => setData({ ...data, backgroundImage: value })}
          placeholder="/assets/img/BUY SHARES IMAGE.jpg"
        />
        <ImageUpload
          onUpload={onUploadBackground!}
          fileRef={backgroundFileRef}
          hint="Or upload an image"
          previewUrl={data.backgroundImage as string | undefined}
        />
      </FormField>

      <FormField label="Main Heading">
        <TextInput
          value={(data.mainHeading as string) || ''}
          onChange={value => setData({ ...data, mainHeading: value })}
          placeholder="invest in artists"
        />
      </FormField>

      <div className={styles.field}>
        <FormField label="Animated Words (comma-separated)">
          <TextInput
            value={Array.isArray(data.animatedWords) ? (data.animatedWords as string[]).join(', ') : ''}
            onChange={value => setData({ ...data, animatedWords: value.split(',').map(w => w.trim()).filter(w => w) })}
            placeholder="it, hits, different"
          />
        </FormField>
        <span className={styles.helperText}>Words will be displayed in sequence with animation</span>
      </div>

      <FormField label="Coming Soon Title">
        <TextInput
          value={(data.comingSoonTitle as string) || ''}
          onChange={value => setData({ ...data, comingSoonTitle: value })}
          placeholder="Coming soon"
        />
      </FormField>

      <FormField label="Date Text">
        <TextInput
          value={(data.dateText as string) || ''}
          onChange={value => setData({ ...data, dateText: value })}
          placeholder="(?/?/2026)"
        />
      </FormField>

      <FormField label="Logo Image URL">
        <TextInput
          value={(data.logoImage as string) || ''}
          onChange={value => setData({ ...data, logoImage: value })}
          placeholder="/assets/img/hardweymainlogo.jpg"
        />
        <ImageUpload
          onUpload={onUploadLogo!}
          fileRef={logoFileRef}
          hint="Or upload an image"
          previewUrl={data.logoImage as string | undefined}
        />
      </FormField>

      <FormField label="Welcome Text">
        <TextInput
          value={(data.welcomeText as string) || ''}
          onChange={value => setData({ ...data, welcomeText: value })}
          placeholder="Welcome to HARDWEY"
        />
      </FormField>
    </>
  );
}

