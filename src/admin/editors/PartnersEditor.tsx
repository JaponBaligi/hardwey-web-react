import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './PartnersEditor.module.css';

export function PartnersEditor({ 
  data, 
  setData, 
  setErr,
  uploadImage
}: SectionEditorProps) {
  const partners = data.partners || [];

  const addPartner = () => {
    const newPartner = {
      id: `partner-${Date.now()}`,
      name: '',
      title: '',
      description: '',
      imageUrl: '',
      imageSrcSet: '',
      websiteUrl: '',
      socialLinks: []
    };
    setData({ ...data, partners: [...partners, newPartner] });
  };

  const removePartner = (idx: number) => {
    const next = partners.filter((_: any, i: number) => i !== idx);
    setData({ ...data, partners: next });
  };

  const updatePartner = (idx: number, field: string, value: any) => {
    const next = [...partners];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, partners: next });
  };

  const handleImageUpload = async (idx: number, file: File) => {
    if (!uploadImage) return;
    try {
      const { url } = await uploadImage(file);
      updatePartner(idx, 'imageUrl', url);
    } catch (err: any) {
      setErr(err.message || 'Failed to upload image');
    }
  };

  const addSocialLink = (partnerIdx: number) => {
    const next = [...partners];
    const socialLinks = [...(next[partnerIdx].socialLinks || []), { platform: '', url: '' }];
    next[partnerIdx] = { ...next[partnerIdx], socialLinks };
    setData({ ...data, partners: next });
  };

  const removeSocialLink = (partnerIdx: number, socialIdx: number) => {
    const next = [...partners];
    const socialLinks = (next[partnerIdx].socialLinks || []).filter((_: any, i: number) => i !== socialIdx);
    next[partnerIdx] = { ...next[partnerIdx], socialLinks };
    setData({ ...data, partners: next });
  };

  const updateSocialLink = (partnerIdx: number, socialIdx: number, field: string, value: string) => {
    const next = [...partners];
    const socialLinks = [...(next[partnerIdx].socialLinks || [])];
    socialLinks[socialIdx] = { ...socialLinks[socialIdx], [field]: value };
    next[partnerIdx] = { ...next[partnerIdx], socialLinks };
    setData({ ...data, partners: next });
  };

  return (
    <>
      <FormField label="Page Title">
        <TextInput
          value={data.pageTitle || ''}
          onChange={value => setData({ ...data, pageTitle: value })}
          placeholder="Our Partners"
        />
      </FormField>

      <FormField label="Page Subtitle">
        <TextInput
          value={data.pageSubtitle || ''}
          onChange={value => setData({ ...data, pageSubtitle: value })}
          placeholder="Building the future of music investment together"
        />
      </FormField>

      <div className={styles.partnersSection}>
        <div className={styles.partnersHeader}>
          <label className={styles.partnersLabel}>
            Partners {partners.length > 0 && (
              <span className={styles.count}>({partners.length} partner{partners.length !== 1 ? 's' : ''})</span>
            )}
          </label>
          <button onClick={addPartner} className={styles.addButton}>
            Add Partner
          </button>
        </div>
        {partners.length === 0 && (
          <div className={styles.emptyState}>
            No partners yet. Click "Add Partner" to add one.
          </div>
        )}
        {partners.map((partner: any, idx: number) => (
          <div key={partner.id || idx} className={styles.partnerItem}>
            <div className={styles.partnerItemHeader}>
              <h4 className={styles.partnerItemTitle}>Partner {idx + 1}</h4>
              <button 
                onClick={() => removePartner(idx)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>

            <FormField label="Name *">
              <TextInput
                value={partner.name || ''}
                onChange={value => updatePartner(idx, 'name', value)}
                placeholder="Partner Name"
              />
            </FormField>

            <FormField label="Title">
              <TextInput
                value={partner.title || ''}
                onChange={value => updatePartner(idx, 'title', value)}
                placeholder="Partner Title"
              />
            </FormField>

            <FormField label="Description">
              <TextAreaInput
                value={partner.description || ''}
                onChange={value => updatePartner(idx, 'description', value)}
                rows={3}
                placeholder="Partner description..."
              />
            </FormField>

            <FormField label="Image URL *">
              <TextInput
                value={partner.imageUrl || ''}
                onChange={value => updatePartner(idx, 'imageUrl', value)}
                placeholder="/uploads/partner.jpg"
              />
              <ImageUpload
                onUpload={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleImageUpload(idx, file);
                }}
                hint="Or upload an image"
                previewUrl={partner.imageUrl}
              />
            </FormField>

            <FormField label="Image SrcSet (optional)">
              <TextInput
                value={partner.imageSrcSet || ''}
                onChange={value => updatePartner(idx, 'imageSrcSet', value)}
                placeholder="/uploads/partner-500.jpg 500w, /uploads/partner-1080.jpg 1080w"
              />
            </FormField>

            <FormField label="Website URL">
              <TextInput
                type="url"
                value={partner.websiteUrl || ''}
                onChange={value => updatePartner(idx, 'websiteUrl', value)}
                placeholder="https://partner-website.com"
              />
            </FormField>

            <div className={styles.socialLinksSection}>
              <div className={styles.socialLinksHeader}>
                <label className={styles.socialLinksLabel}>
                  Social Links {(partner.socialLinks || []).length > 0 && (
                    <span className={styles.count}>({(partner.socialLinks || []).length})</span>
                  )}
                </label>
                <button
                  onClick={() => addSocialLink(idx)}
                  className={styles.addSocialButton}
                >
                  Add Social Link
                </button>
              </div>
              {(partner.socialLinks || []).map((social: any, socialIdx: number) => (
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

