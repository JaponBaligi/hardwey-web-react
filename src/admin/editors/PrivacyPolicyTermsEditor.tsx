import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import styles from './PrivacyPolicyTermsEditor.module.css';

interface PrivacyPolicyTermsEditorProps extends SectionEditorProps {
  section: string;
}

export function PrivacyPolicyTermsEditor({ 
  data, 
  setData,
  section
}: PrivacyPolicyTermsEditorProps) {
  const introText = data.introText || [];
  const sections = data.sections || [];

  const addIntroParagraph = () => {
    setData({ ...data, introText: [...introText, ''] });
  };

  const removeIntroParagraph = (idx: number) => {
    const updated = [...introText];
    updated.splice(idx, 1);
    setData({ ...data, introText: updated });
  };

  const updateIntroParagraph = (idx: number, value: string) => {
    const updated = [...introText];
    updated[idx] = value;
    setData({ ...data, introText: updated });
  };

  const addSection = () => {
    const newSection = {
      title: '',
      paragraphs: [],
      lists: []
    };
    setData({ ...data, sections: [...sections, newSection] });
  };

  const removeSection = (secIdx: number) => {
    const updated = [...sections];
    updated.splice(secIdx, 1);
    setData({ ...data, sections: updated });
  };

  const updateSectionTitle = (secIdx: number, value: string) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], title: value };
    setData({ ...data, sections: updated });
  };

  const addSectionParagraph = (secIdx: number) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], paragraphs: [...(updated[secIdx].paragraphs || []), ''] };
    setData({ ...data, sections: updated });
  };

  const removeSectionParagraph = (secIdx: number, paraIdx: number) => {
    const updated = [...sections];
    updated[secIdx].paragraphs.splice(paraIdx, 1);
    setData({ ...data, sections: updated });
  };

  const updateSectionParagraph = (secIdx: number, paraIdx: number, value: string) => {
    const updated = [...sections];
    updated[secIdx].paragraphs[paraIdx] = value;
    setData({ ...data, sections: updated });
  };

  const addSectionList = (secIdx: number) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], lists: [...(updated[secIdx].lists || []), []] };
    setData({ ...data, sections: updated });
  };

  const removeSectionList = (secIdx: number, listIdx: number) => {
    const updated = [...sections];
    updated[secIdx].lists.splice(listIdx, 1);
    setData({ ...data, sections: updated });
  };

  const addListItem = (secIdx: number, listIdx: number) => {
    const updated = [...sections];
    updated[secIdx].lists[listIdx].push('');
    setData({ ...data, sections: updated });
  };

  const removeListItem = (secIdx: number, listIdx: number, itemIdx: number) => {
    const updated = [...sections];
    updated[secIdx].lists[listIdx].splice(itemIdx, 1);
    setData({ ...data, sections: updated });
  };

  const updateListItem = (secIdx: number, listIdx: number, itemIdx: number, value: string) => {
    const updated = [...sections];
    updated[secIdx].lists[listIdx][itemIdx] = value;
    setData({ ...data, sections: updated });
  };

  const updateDisclaimer = (secIdx: number, field: 'title' | 'text', value: string) => {
    const updated = [...sections];
    updated[secIdx] = {
      ...updated[secIdx],
      disclaimer: { ...(updated[secIdx].disclaimer || {}), [field]: value }
    };
    setData({ ...data, sections: updated });
  };

  const removeDisclaimer = (secIdx: number) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], disclaimer: undefined };
    setData({ ...data, sections: updated });
  };

  const updateContactInfo = (secIdx: number, field: 'email' | 'address', value: string) => {
    const updated = [...sections];
    updated[secIdx] = {
      ...updated[secIdx],
      contactInfo: { ...(updated[secIdx].contactInfo || {}), [field]: value }
    };
    setData({ ...data, sections: updated });
  };

  const removeContactInfo = (secIdx: number) => {
    const updated = [...sections];
    updated[secIdx] = { ...updated[secIdx], contactInfo: undefined };
    setData({ ...data, sections: updated });
  };

  return (
    <>
      {(sections.length === 0 && introText.length === 0) && (
        <div className={styles.emptyState}>
          No content loaded. If you have existing content, try clicking "Reload current" or check the JSON view below.
        </div>
      )}

      <FormField label="Page Title">
        <TextInput
          value={data.pageTitle || ''}
          onChange={value => setData({ ...data, pageTitle: value })}
          placeholder={section === 'privacyPolicy' ? 'Privacy Policy' : 'Terms of Service'}
        />
      </FormField>

      <FormField label="Last Updated">
        <TextInput
          value={data.lastUpdated || ''}
          onChange={value => setData({ ...data, lastUpdated: value })}
          placeholder="October 11th, 2025"
        />
      </FormField>

      <div className={styles.introSection}>
        <div className={styles.sectionHeader}>
          <label className={styles.sectionLabel}>
            Intro Text {introText.length > 0 && (
              <span className={styles.count}>({introText.length} paragraph{introText.length !== 1 ? 's' : ''})</span>
            )}
          </label>
          <button onClick={addIntroParagraph} className={styles.addSmallButton}>
            Add Paragraph
          </button>
        </div>
        {introText.length === 0 && (
          <div className={styles.emptySubState}>
            No intro paragraphs. Click "Add Paragraph" to add one.
          </div>
        )}
        {introText.map((para: string, idx: number) => (
          <div key={idx} className={styles.introParagraph}>
            <div className={styles.textAreaRow}>
              <TextAreaInput
                value={para}
                onChange={value => updateIntroParagraph(idx, value)}
                rows={3}
                placeholder="Enter intro paragraph..."
              />
              <button
                onClick={() => removeIntroParagraph(idx)}
                className={styles.removeSmallButton}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionsContainer}>
        <div className={styles.sectionHeader}>
          <label className={styles.sectionLabel}>
            Sections {sections.length > 0 && (
              <span className={styles.count}>({sections.length} section{sections.length !== 1 ? 's' : ''})</span>
            )}
          </label>
          <button onClick={addSection} className={styles.addButton}>
            Add Section
          </button>
        </div>
        {sections.length === 0 && (
          <div className={styles.emptySubState}>
            No sections yet. Click "Add Section" to add one, or check the "Current (server)" JSON below to see what data exists.
          </div>
        )}
        {sections.map((sec: any, secIdx: number) => (
          <div key={secIdx} className={styles.sectionItem}>
            <div className={styles.sectionItemHeader}>
              <h4 className={styles.sectionItemTitle}>Section {secIdx + 1}</h4>
              <button
                onClick={() => removeSection(secIdx)}
                className={styles.removeTinyButton}
              >
                Remove
              </button>
            </div>

            <FormField label="Title">
              <TextInput
                value={sec.title || ''}
                onChange={value => updateSectionTitle(secIdx, value)}
                placeholder="Section title"
              />
            </FormField>

            <div className={styles.paragraphsSection}>
              <div className={styles.subSectionHeader}>
                <label className={styles.subLabel}>Paragraphs</label>
                <button
                  onClick={() => addSectionParagraph(secIdx)}
                  className={styles.addTinyButton}
                >
                  Add
                </button>
              </div>
              {(sec.paragraphs || []).map((para: string, paraIdx: number) => (
                <div key={paraIdx} className={styles.paragraphRow}>
                  <TextAreaInput
                    value={para}
                    onChange={value => updateSectionParagraph(secIdx, paraIdx, value)}
                    rows={2}
                    placeholder="Paragraph text..."
                  />
                  <button
                    onClick={() => removeSectionParagraph(secIdx, paraIdx)}
                    className={styles.removeTinyButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.listsSection}>
              <div className={styles.subSectionHeader}>
                <label className={styles.subLabel}>Lists</label>
                <button
                  onClick={() => addSectionList(secIdx)}
                  className={styles.addTinyButton}
                >
                  Add List
                </button>
              </div>
              {(sec.lists || []).map((list: string[], listIdx: number) => (
                <div key={listIdx} className={styles.listContainer}>
                  <div className={styles.listHeader}>
                    <label className={styles.listLabel}>List {listIdx + 1}</label>
                    <button
                      onClick={() => removeSectionList(secIdx, listIdx)}
                      className={styles.removeMicroButton}
                    >
                      Remove
                    </button>
                  </div>
                  {list.map((item: string, itemIdx: number) => (
                    <div key={itemIdx} className={styles.listItemRow}>
                      <TextInput
                        value={item}
                        onChange={value => updateListItem(secIdx, listIdx, itemIdx, value)}
                        placeholder={`List item ${itemIdx + 1}`}
                        className={styles.listItemInput}
                      />
                      <button
                        onClick={() => removeListItem(secIdx, listIdx, itemIdx)}
                        className={styles.removeTinyButton}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem(secIdx, listIdx)}
                    className={styles.addTinyButton}
                  >
                    + Add Item
                  </button>
                </div>
              ))}
            </div>

            {section === 'terms' && (
              <div className={styles.disclaimerSection}>
                <FormField label="Disclaimer (Optional)">
                  <TextInput
                    value={sec.disclaimer?.title || ''}
                    onChange={value => updateDisclaimer(secIdx, 'title', value)}
                    placeholder="Disclaimer title"
                  />
                  <TextAreaInput
                    value={sec.disclaimer?.text || ''}
                    onChange={value => updateDisclaimer(secIdx, 'text', value)}
                    rows={3}
                    placeholder="Disclaimer text"
                  />
                  {(sec.disclaimer?.title || sec.disclaimer?.text) && (
                    <button
                      onClick={() => removeDisclaimer(secIdx)}
                      className={styles.removeTinyButton}
                    >
                      Remove Disclaimer
                    </button>
                  )}
                </FormField>
              </div>
            )}

            <div className={styles.contactInfoSection}>
              <FormField label="Contact Info (Optional)">
                <TextInput
                  type="email"
                  value={sec.contactInfo?.email || ''}
                  onChange={value => updateContactInfo(secIdx, 'email', value)}
                  placeholder="Email address"
                />
                <TextInput
                  value={sec.contactInfo?.address || ''}
                  onChange={value => updateContactInfo(secIdx, 'address', value)}
                  placeholder="Physical address"
                />
                {(sec.contactInfo?.email || sec.contactInfo?.address) && (
                  <button
                    onClick={() => removeContactInfo(secIdx)}
                    className={styles.removeTinyButton}
                  >
                    Remove Contact Info
                  </button>
                )}
              </FormField>
            </div>
          </div>
        ))}
      </div>

      <FormField label="Footer Button Text">
        <TextInput
          value={data.footerButtonText || ''}
          onChange={value => setData({ ...data, footerButtonText: value })}
          placeholder="Contact Us"
        />
      </FormField>

      <FormField label="Footer Button Email">
        <TextInput
          type="email"
          value={data.footerButtonEmail || ''}
          onChange={value => setData({ ...data, footerButtonEmail: value })}
          placeholder="hello@hardweyllc.com"
        />
      </FormField>
    </>
  );
}

