import type { SectionEditorProps } from './types';
import { FormField, TextInput } from '../components/FormField';
import styles from './TickerEditor.module.css';

export function TickerEditor({ data, setData }: SectionEditorProps) {
  return (
    <>
      <FormField label="Background Color">
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={data.backgroundColor || '#bbdbfa'}
            onChange={e => setData({ ...data, backgroundColor: e.target.value })}
            className={styles.colorInput}
          />
          <TextInput
            value={data.backgroundColor || '#bbdbfa'}
            onChange={value => setData({ ...data, backgroundColor: value })}
            placeholder="#bbdbfa"
            className={styles.colorTextInput}
          />
        </div>
      </FormField>

      <div className={styles.field}>
        <FormField label="Ticker Words (comma-separated)">
          <TextInput
            value={(data.tickerWords || []).join(', ')}
            onChange={value => {
              const words = value.split(',').map(w => w.trim()).filter(w => w);
              setData({ ...data, tickerWords: words });
            }}
            placeholder="Music, Shows, Merch, More"
          />
        </FormField>
        <span className={styles.helperText}>Separate words with commas</span>
      </div>
    </>
  );
}

