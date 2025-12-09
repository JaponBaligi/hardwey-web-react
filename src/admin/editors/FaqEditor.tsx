import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import styles from './FaqEditor.module.css';

export function FaqEditor({ data, setData }: SectionEditorProps) {
  const faqItems = data.faqItems || [];

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
    const next = faqItems.filter((_: any, i: number) => i !== idx);
    setData({ ...data, faqItems: next });
  };

  const updateFaqItem = (idx: number, field: string, value: string) => {
    const next = [...faqItems];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, faqItems: next });
  };

  return (
    <>
      <div className={styles.actions}>
        <button onClick={addFaqItem} className={styles.addButton}>
          Add FAQ Item
        </button>
      </div>
      
      {faqItems.map((faq: any, idx: number) => (
        <div key={faq.id || idx} className={styles.faqItem}>
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
        </div>
      ))}
    </>
  );
}

