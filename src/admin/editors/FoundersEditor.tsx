import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './FoundersEditor.module.css';

export function FoundersEditor({ 
  data, 
  setData, 
  setErr,
  uploadImage
}: SectionEditorProps) {
  const founders = data.founders || [];

  const addFounder = () => {
    const newFounder = {
      id: `founder-${Date.now()}`,
      name: '',
      role: '',
      bio: '',
      quote: '',
      imageUrl: '',
      imageSrcSet: '',
      additionalInfo: ['']
    };
    setData({ ...data, founders: [...founders, newFounder] });
  };

  const removeFounder = (idx: number) => {
    const next = founders.filter((_: any, i: number) => i !== idx);
    setData({ ...data, founders: next });
  };

  const updateFounder = (idx: number, field: string, value: any) => {
    const next = [...founders];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, founders: next });
  };

  const handleImageUpload = async (idx: number, file: File) => {
    if (!uploadImage) return;
    try {
      const { url } = await uploadImage(file);
      updateFounder(idx, 'imageUrl', url);
    } catch (err: any) {
      setErr(err.message || 'Failed to upload image');
    }
  };

  return (
    <>
      <FormField label="Heading (Plural)">
        <TextInput
          value={data.heading || ''}
          onChange={value => setData({ ...data, heading: value })}
          placeholder="The Founders"
        />
        <span className={styles.helperText}>Used when there are multiple founders</span>
      </FormField>

      <FormField label="Heading (Singular)">
        <TextInput
          value={data.headingSingular || ''}
          onChange={value => setData({ ...data, headingSingular: value })}
          placeholder="The Founder"
        />
        <span className={styles.helperText}>Used when there is only one founder</span>
      </FormField>

      <FormField label="Animated Words (comma-separated)">
        <TextInput
          value={Array.isArray(data.animatedWords) ? data.animatedWords.join(', ') : ''}
          onChange={value => {
            const words = value.split(',').map(w => w.trim()).filter(w => w);
            setData({ ...data, animatedWords: words });
          }}
          placeholder="long, story, short"
        />
        <span className={styles.helperText}>Words displayed with animation (desktop)</span>
      </FormField>

      <FormField label="Animated Text (Mobile)">
        <TextInput
          value={data.animatedTextMobile || ''}
          onChange={value => setData({ ...data, animatedTextMobile: value })}
          placeholder="Long story short"
        />
        <span className={styles.helperText}>Full text displayed on mobile</span>
      </FormField>

      <div className={styles.actions}>
        <button onClick={addFounder} className={styles.addButton}>
          Add Founder
        </button>
      </div>

      {founders.map((founder: any, idx: number) => (
        <div key={founder.id || idx} className={styles.founderItem}>
          <div className={styles.founderItemHeader}>
            <h4 className={styles.founderItemTitle}>Founder {idx + 1}</h4>
            <button 
              onClick={() => removeFounder(idx)}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>

          <FormField label="Name">
            <TextInput
              value={founder.name || ''}
              onChange={value => updateFounder(idx, 'name', value)}
              placeholder="Metehan İlikhan"
            />
          </FormField>

          <FormField label="Role">
            <TextInput
              value={founder.role || ''}
              onChange={value => updateFounder(idx, 'role', value)}
              placeholder="Founder & CEO"
            />
          </FormField>

          <FormField label="Quote">
            <TextInput
              value={founder.quote || ''}
              onChange={value => updateFounder(idx, 'quote', value)}
              placeholder="We're building a movement in music"
            />
          </FormField>

          <FormField label="Bio">
            <TextAreaInput
              value={founder.bio || ''}
              onChange={value => updateFounder(idx, 'bio', value)}
              rows={4}
              placeholder="More than a decade ago, our friendship sparked..."
            />
          </FormField>

          <FormField label="Image URL">
            <TextInput
              value={founder.imageUrl || ''}
              onChange={value => updateFounder(idx, 'imageUrl', value)}
              placeholder="/assets/banner/founder.jpg"
            />
            <ImageUpload
              onUpload={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await handleImageUpload(idx, file);
              }}
              hint="Or upload an image"
              previewUrl={founder.imageUrl}
            />
          </FormField>

          <FormField label="Image SrcSet">
            <TextInput
              value={founder.imageSrcSet || ''}
              onChange={value => updateFounder(idx, 'imageSrcSet', value)}
              placeholder="/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w"
            />
          </FormField>

          <FormField label="Additional Info (one per line)">
            <TextAreaInput
              value={Array.isArray(founder.additionalInfo) ? founder.additionalInfo.join('\n') : ''}
              onChange={value => {
                const info = value.split('\n').filter(line => line.trim());
                updateFounder(idx, 'additionalInfo', info);
              }}
              rows={3}
              placeholder="Passionate about democratizing music investment&#10;Believes in the power of artist-fan connections"
            />
            <span className={styles.helperText}>Each line will be a separate info item</span>
          </FormField>
        </div>
      ))}
    </>
  );
}

