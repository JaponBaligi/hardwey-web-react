import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './CollaborativesEditor.module.css';

export function CollaborativesEditor({ 
  data, 
  setData, 
  setErr,
  uploadImage
}: SectionEditorProps) {
  const collaboratives = data.collaboratives || [];

  const addCollaborative = () => {
    const newCollaborative = {
      id: `collaborative-${Date.now()}`,
      name: '',
      title: '',
      description: '',
      imageUrl: '',
      imageSrcSet: '',
      websiteUrl: '',
      socialLinks: []
    };
    setData({ ...data, collaboratives: [...collaboratives, newCollaborative] });
  };

  const removeCollaborative = (idx: number) => {
    const next = collaboratives.filter((_: any, i: number) => i !== idx);
    setData({ ...data, collaboratives: next });
  };

  const updateCollaborative = (idx: number, field: string, value: any) => {
    const next = [...collaboratives];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, collaboratives: next });
  };

  const handleImageUpload = async (idx: number, file: File) => {
    if (!uploadImage) return;
    try {
      const { url } = await uploadImage(file);
      updateCollaborative(idx, 'imageUrl', url);
    } catch (err: any) {
      setErr(err.message || 'Failed to upload image');
    }
  };

  const addSocialLink = (collaborativeIdx: number) => {
    const next = [...collaboratives];
    const socialLinks = [...(next[collaborativeIdx].socialLinks || []), { platform: '', url: '' }];
    next[collaborativeIdx] = { ...next[collaborativeIdx], socialLinks };
    setData({ ...data, collaboratives: next });
  };

  const removeSocialLink = (collaborativeIdx: number, socialIdx: number) => {
    const next = [...collaboratives];
    const socialLinks = (next[collaborativeIdx].socialLinks || []).filter((_: any, i: number) => i !== socialIdx);
    next[collaborativeIdx] = { ...next[collaborativeIdx], socialLinks };
    setData({ ...data, collaboratives: next });
  };

  const updateSocialLink = (collaborativeIdx: number, socialIdx: number, field: string, value: string) => {
    const next = [...collaboratives];
    const socialLinks = [...(next[collaborativeIdx].socialLinks || [])];
    socialLinks[socialIdx] = { ...socialLinks[socialIdx], [field]: value };
    next[collaborativeIdx] = { ...next[collaborativeIdx], socialLinks };
    setData({ ...data, collaboratives: next });
  };

  return (
    <>
      <FormField label="Section Heading">
        <TextInput
          value={data.heading || ''}
          onChange={value => setData({ ...data, heading: value })}
          placeholder="Collaboratives"
        />
      </FormField>

      <div className={styles.collaborativesSection}>
        <div className={styles.collaborativesHeader}>
          <label className={styles.collaborativesLabel}>
            Collaboratives {collaboratives.length > 0 && (
              <span className={styles.count}>({collaboratives.length} collaborative{collaboratives.length !== 1 ? 's' : ''})</span>
            )}
          </label>
          <button onClick={addCollaborative} className={styles.addButton}>
            Add Collaborative
          </button>
        </div>
        {collaboratives.length === 0 && (
          <div className={styles.emptyState}>
            No collaboratives yet. Click "Add Collaborative" to add one.
          </div>
        )}
        {collaboratives.map((collaborative: any, idx: number) => (
          <div key={collaborative.id || idx} className={styles.collaborativeItem}>
            <div className={styles.collaborativeItemHeader}>
              <h4 className={styles.collaborativeItemTitle}>Collaborative {idx + 1}</h4>
              <button 
                onClick={() => removeCollaborative(idx)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>

            <FormField label="Name *">
              <TextInput
                value={collaborative.name || ''}
                onChange={value => updateCollaborative(idx, 'name', value)}
                placeholder="Collaborative Name"
              />
            </FormField>

            <FormField label="Title">
              <TextInput
                value={collaborative.title || ''}
                onChange={value => updateCollaborative(idx, 'title', value)}
                placeholder="Collaborative Title"
              />
            </FormField>

            <FormField label="Description">
              <TextAreaInput
                value={collaborative.description || ''}
                onChange={value => updateCollaborative(idx, 'description', value)}
                rows={3}
                placeholder="Collaborative description..."
              />
            </FormField>

            <FormField label="Image URL *">
              <TextInput
                value={collaborative.imageUrl || ''}
                onChange={value => updateCollaborative(idx, 'imageUrl', value)}
                placeholder="/uploads/collaborative.jpg"
              />
              <ImageUpload
                onUpload={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleImageUpload(idx, file);
                }}
                hint="Or upload an image"
                previewUrl={collaborative.imageUrl}
              />
            </FormField>

            <FormField label="Image SrcSet (optional)">
              <TextInput
                value={collaborative.imageSrcSet || ''}
                onChange={value => updateCollaborative(idx, 'imageSrcSet', value)}
                placeholder="/uploads/collaborative-500.jpg 500w, /uploads/collaborative-1080.jpg 1080w"
              />
            </FormField>

            <FormField label="Website URL">
              <TextInput
                type="url"
                value={collaborative.websiteUrl || ''}
                onChange={value => updateCollaborative(idx, 'websiteUrl', value)}
                placeholder="https://collaborative-website.com"
              />
            </FormField>

            <div className={styles.socialLinksSection}>
              <div className={styles.socialLinksHeader}>
                <label className={styles.socialLinksLabel}>
                  Social Links {(collaborative.socialLinks || []).length > 0 && (
                    <span className={styles.count}>({(collaborative.socialLinks || []).length})</span>
                  )}
                </label>
                <button
                  onClick={() => addSocialLink(idx)}
                  className={styles.addSocialButton}
                >
                  Add Social Link
                </button>
              </div>
              {(collaborative.socialLinks || []).map((social: any, socialIdx: number) => (
                <div key={socialIdx} className={styles.socialLinkRow}>
                  <TextInput
                    placeholder="Platform (e.g., Twitter, LinkedIn)"
                    value={social.platform || ''}
                    onChange={value => updateSocialLink(idx, socialIdx, 'platform', value)}
                    className={styles.platformInput}
                  />
                  <TextInput
                    type="url"
                    placeholder="URL"
                    value={social.url || ''}
                    onChange={value => updateSocialLink(idx, socialIdx, 'url', value)}
                    className={styles.urlInput}
                  />
                  <button
                    onClick={() => removeSocialLink(idx, socialIdx)}
                    className={styles.removeSocialButton}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

