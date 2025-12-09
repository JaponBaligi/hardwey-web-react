import type { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { getStringValue, getArrayValue } from '../utils/dataHelpers';
import type { FaqItem } from '@/types/content';
import styles from './MoreFaqEditor.module.css';

export function MoreFaqEditor({ 
  data, 
  setData, 
  setErr,
  uploadImage
}: SectionEditorProps) {
  const faqItems = getArrayValue<FaqItem>(data, 'faqItems');

  const addFaqItem = () => {
    const newItem = {
      id: `faq-${Date.now()}`,
      question: '',
      subtitle: '',
      answer: '',
      additionalInfo: ['', '']
    };
    setData({ ...data, faqItems: [...faqItems, newItem] });
  };

  const removeFaqItem = (idx: number) => {
    const next = faqItems.filter((_: FaqItem, i: number) => i !== idx);
    setData({ ...data, faqItems: next });
  };

  const updateFaqItem = (idx: number, field: string, value: string | string[]) => {
    const next = [...faqItems];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, faqItems: next });
  };

  const updateAdditionalInfo = (idx: number, lineIndex: number, value: string) => {
    const next = [...faqItems];
    const additionalInfo = Array.isArray(next[idx].additionalInfo) ? [...next[idx].additionalInfo] : ['', ''];
    additionalInfo[lineIndex] = value;
    next[idx] = { ...next[idx], additionalInfo };
    setData({ ...data, faqItems: next });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadImage) return;
    try {
      const { url } = await uploadImage(file);
      setData({ ...data, imageUrl: url });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      setErr(message);
    }
  };

  return (
    <>
      <FormField label="Page Title">
        <TextInput
          value={getStringValue(data, 'pageTitle')}
          onChange={value => setData({ ...data, pageTitle: value })}
          placeholder="More FAQ It"
        />
      </FormField>

      <FormField label="Page Subtitle">
        <TextAreaInput
          value={getStringValue(data, 'pageSubtitle')}
          onChange={value => setData({ ...data, pageSubtitle: value })}
          rows={2}
          placeholder="Everything you need to know about investing in artists"
        />
      </FormField>

      <div className={styles.faqSection}>
        <div className={styles.faqCount}>
          {Array.isArray(faqItems) && faqItems.length > 0 
            ? `${faqItems.length} FAQ item(s) loaded`
            : 'No FAQ items found'}
        </div>
        <button onClick={addFaqItem} className={styles.addButton}>
          Add FAQ Item
        </button>
        {(!faqItems || !Array.isArray(faqItems) || faqItems.length === 0) && (
          <div className={styles.emptyState}>
            No FAQ items found. Click "Add FAQ Item" to create one, or click "Reload current" if you expect items to exist.
          </div>
        )}
        {Array.isArray(faqItems) && faqItems.map((faq: FaqItem, idx: number) => (
          <div key={faq.id || `faq-${idx}`} className={styles.faqItem}>
            <div className={styles.faqItemHeader}>
              <h4 className={styles.faqItemTitle}>FAQ Item {idx + 1}</h4>
              <button 
                onClick={() => removeFaqItem(idx)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>

            <FormField label="Heading (Question)">
              <TextInput
                value={faq.question || ''}
                onChange={value => updateFaqItem(idx, 'question', value)}
                placeholder="How does it work?"
              />
            </FormField>

            <FormField label="Supportive Text (Subtitle)">
              <TextInput
                value={faq.subtitle || ''}
                onChange={value => updateFaqItem(idx, 'subtitle', value)}
                placeholder="It's remarkably simple"
              />
            </FormField>

            <FormField label="Description (Answer)">
              <TextAreaInput
                value={faq.answer || ''}
                onChange={value => updateFaqItem(idx, 'answer', value)}
                rows={4}
                placeholder="We work closely with artists and their teams to launch their shares on HARDWEY..."
              />
            </FormField>

            <FormField label="Additional Info Line 1">
              <TextInput
                value={Array.isArray(faq.additionalInfo) && faq.additionalInfo[0] ? faq.additionalInfo[0] : ''}
                onChange={value => updateAdditionalInfo(idx, 0, value)}
                placeholder="Additional information line 1"
              />
            </FormField>

            <FormField label="Additional Info Line 2">
              <TextInput
                value={Array.isArray(faq.additionalInfo) && faq.additionalInfo[1] ? faq.additionalInfo[1] : ''}
                onChange={value => updateAdditionalInfo(idx, 1, value)}
                placeholder="Additional information line 2"
              />
            </FormField>
          </div>
        ))}
      </div>

      <FormField label="Image URL">
        <TextInput
          value={getStringValue(data, 'imageUrl')}
          onChange={value => setData({ ...data, imageUrl: value })}
          placeholder="https://..."
        />
        <ImageUpload
          onUpload={handleImageUpload}
          hint="Or upload an image"
          previewUrl={getStringValue(data, 'imageUrl') || undefined}
        />
      </FormField>

      <FormField label="Contact Heading">
        <TextInput
          value={getStringValue(data, 'contactHeading')}
          onChange={value => setData({ ...data, contactHeading: value })}
          placeholder="More questions? We've got more answers"
        />
      </FormField>

      <FormField label="Contact Button Text">
        <TextInput
          value={getStringValue(data, 'contactButtonText')}
          onChange={value => setData({ ...data, contactButtonText: value })}
          placeholder="don't be shy, it's okay to send mail"
        />
      </FormField>

      <FormField label="Contact Email">
        <TextInput
          type="email"
          value={getStringValue(data, 'contactEmail')}
          onChange={value => setData({ ...data, contactEmail: value })}
          placeholder="hello@hardweyllc.com"
        />
      </FormField>
    </>
  );
}

