import type { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { getStringValue, getArrayValue } from '../utils/dataHelpers';
import styles from './SectionEditorBase.module.css';

export function HeroEditor({ 
  data, 
  setData, 
  onUpload, 
  onUploadBackground, 
  onUploadLogo,
  fileRef, 
  backgroundFileRef,
  logoFileRef 
}: SectionEditorProps) {
  function addMotif() {
    setData((prev) => ({ ...prev, motifs: [...((prev as { motifs?: string[] }).motifs || []), ''] }));
  }

  function removeMotif(i: number) {
    setData((prev) => {
      const prevData = prev as { motifs?: string[] };
      return { ...prevData, motifs: (prevData.motifs || []).filter((_: string, idx: number) => idx !== i) };
    });
  }

  return (
    <>
      <FormField label="Logo URL">
        <TextInput
          value={getStringValue(data, 'logoUrl')}
          onChange={value => setData({ ...data, logoUrl: value })}
          placeholder="/assets/img/hardweybannertext.png"
        />
        {onUploadLogo && logoFileRef && (
          <ImageUpload
            onUpload={onUploadLogo}
            fileRef={logoFileRef}
            previewUrl={getStringValue(data, 'logoUrl') || undefined}
          />
        )}
      </FormField>

      <FormField label="MITA Text">
        <TextInput
          value={getStringValue(data, 'mitaText')}
          onChange={value => setData({ ...data, mitaText: value })}
          placeholder="Music is the answer™"
        />
      </FormField>

      <FormField label="Subtitle">
        <TextInput
          value={getStringValue(data, 'subtitle')}
          onChange={value => setData({ ...data, subtitle: value })}
          placeholder="A movement in music. Redefining the rules."
        />
      </FormField>

      <FormField label="Background Image URL">
        <TextInput
          value={getStringValue(data, 'backgroundImage')}
          onChange={value => setData({ ...data, backgroundImage: value })}
          placeholder="https://..."
        />
        {onUploadBackground && backgroundFileRef && (
          <ImageUpload
            onUpload={onUploadBackground}
            fileRef={backgroundFileRef}
            previewUrl={getStringValue(data, 'backgroundImage') || undefined}
          />
        )}
      </FormField>

      <FormField label="Background Image SrcSet (optional)">
        <TextAreaInput
          value={getStringValue(data, 'backgroundImageSrcSet')}
          onChange={value => setData({ ...data, backgroundImageSrcSet: value })}
          rows={3}
          placeholder="/assets/banner/artistlarge1-p-500.jpg 500w, ..."
        />
      </FormField>

      <FormField label="Left Identifier (SVG URL)">
        <TextInput
          value={getStringValue(data, 'leftIdentifier')}
          onChange={value => setData({ ...data, leftIdentifier: value })}
          placeholder="/assets/svg/investident-hero.svg"
        />
      </FormField>

      <FormField label="Right Identifier (SVG URL)">
        <TextInput
          value={getStringValue(data, 'rightIdentifier')}
          onChange={value => setData({ ...data, rightIdentifier: value })}
          placeholder="/assets/svg/barcode-ident.svg"
        />
      </FormField>

      <FormField label="Motifs (SVG URLs)">
        <button onClick={addMotif} style={{ marginBottom: 8 }}>
          Add Motif
        </button>
        <ul className={styles.list}>
          {getArrayValue<string>(data, 'motifs').map((motif: string, idx: number) => (
            <li key={idx} className={styles.listItem}>
              <span style={{ marginRight: 8, fontSize: 12, color: '#666' }}>Motif {idx + 1}:</span>
              <TextInput
                value={motif}
                onChange={value => {
                  const motifs = getArrayValue<string>(data, 'motifs');
                  const next = [...motifs];
                  next[idx] = value;
                  setData({ ...data, motifs: next });
                }}
                className={styles.listInput}
                placeholder="/assets/svg/motif.svg"
              />
              <button 
                onClick={() => removeMotif(idx)}
                className={styles.removeButton}
              >
                Remove
              </button>
              {motif && (
                <div style={{ marginTop: 4, width: '100%' }}>
                  <img 
                    src={motif || undefined} 
                    alt={`Motif ${idx + 1}`} 
                    style={{ maxHeight: 40, maxWidth: 100, border: '1px solid #eee' }} 
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
        {onUpload && fileRef && (
          <ImageUpload
            onUpload={onUpload}
            fileRef={fileRef}
            hint="Upload motif image"
          />
        )}
      </FormField>
    </>
  );
}

