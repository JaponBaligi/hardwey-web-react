import { SectionEditorProps } from './types';
import { FormField, TextInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import styles from './FaqIntroEditor.module.css';

export function FaqIntroEditor({ 
  data, 
  setData, 
  setErr,
  uploadImage
}: SectionEditorProps) {
  const records = data.records || [];

  const addRecord = () => {
    const newRecord = {
      id: `record-${Date.now()}`,
      imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
      spotifyUrl: 'https://open.spotify.com/'
    };
    setData({ ...data, records: [...records, newRecord] });
  };

  const removeRecord = (idx: number) => {
    const updated = [...records];
    updated.splice(idx, 1);
    setData({ ...data, records: updated });
  };

  const updateRecord = (idx: number, field: string, value: string) => {
    const updated = [...records];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, records: updated });
  };

  const handleImageUpload = async (idx: number, file: File) => {
    if (!uploadImage) return;
    try {
      const { url } = await uploadImage(file);
      updateRecord(idx, 'imageUrl', url);
    } catch (err: any) {
      setErr(err.message || 'Failed to upload image');
    }
  };

  return (
    <>
      <FormField label="Star Count">
        <input
          type="number"
          value={data.starCount ?? 7}
          onChange={e => setData({ ...data, starCount: parseInt(e.target.value, 10) || 0 })}
          min="0"
          max="50"
          className={styles.numberInput}
        />
        <span className={styles.helperText}>Number of asterisk stars to display</span>
      </FormField>

      <div className={styles.recordsSection}>
        <div className={styles.recordsHeader}>
          <label className={styles.recordsLabel}>Records</label>
          <button onClick={addRecord} className={styles.addButton}>
            Add Record
          </button>
        </div>
        {records.length === 0 && (
          <div className={styles.emptyState}>
            No records yet. Click "Add Record" to add one.
          </div>
        )}
        {records.map((record: any, idx: number) => (
          <div key={record.id || idx} className={styles.recordItem}>
            <div className={styles.recordItemHeader}>
              <h4 className={styles.recordItemTitle}>Record {idx + 1}</h4>
              <button 
                onClick={() => removeRecord(idx)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>

            <FormField label="Image URL">
              <TextInput
                value={record.imageUrl || ''}
                onChange={value => updateRecord(idx, 'imageUrl', value)}
                placeholder="/assets/img/Playlist R&B Retro Nostalgia.png"
              />
              <ImageUpload
                onUpload={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleImageUpload(idx, file);
                }}
                hint="Or upload an image"
                previewUrl={record.imageUrl}
              />
            </FormField>

            <FormField label="Spotify URL">
              <TextInput
                value={record.spotifyUrl || ''}
                onChange={value => updateRecord(idx, 'spotifyUrl', value)}
                placeholder="https://open.spotify.com/"
              />
            </FormField>
          </div>
        ))}
      </div>
    </>
  );
}

