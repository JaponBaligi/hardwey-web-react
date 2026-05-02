import type { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { getStringValue, getArrayValue } from '../utils/dataHelpers';
import styles from './PrivacyPolicyTermsEditor.module.css';

interface PrivacyPolicyTermsEditorProps extends SectionEditorProps {
  section: string;
}

interface PolicySection {
  title: string;
  paragraphs: string[];
  lists?: string[][];
  disclaimer?: {
    title?: string;
    text?: string;
  };
  contactInfo?: {
    email?: string;
    address?: string;
  };
}

interface ParagraphsSectionProps {
  paragraphs: string[];
  secIdx: number;
  onAddParagraph: (idx: number) => void;
  onRemoveParagraph: (idx: number, paraIdx: number) => void;
  onUpdateParagraph: (idx: number, paraIdx: number, value: string) => void;
}

function ParagraphsSection({
  paragraphs,
  secIdx,
  onAddParagraph,
  onRemoveParagraph,
  onUpdateParagraph,
}: ParagraphsSectionProps) {
  return (
    <div className={styles.paragraphsSection}>
      <div className={styles.subSectionHeader}>
        <label className={styles.subLabel}>Paragraphs</label>
        <button
          onClick={() => onAddParagraph(secIdx)}
          className={styles.addTinyButton}
        >
          Add
        </button>
      </div>
      {paragraphs.map((para: string, paraIdx: number) => (
        <div key={paraIdx} className={styles.paragraphRow}>
          <TextAreaInput
            value={para}
            onChange={value => onUpdateParagraph(secIdx, paraIdx, value)}
            rows={2}
            placeholder="Paragraph text..."
          />
          <button
            onClick={() => onRemoveParagraph(secIdx, paraIdx)}
            className={styles.removeTinyButton}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

interface ListsSectionProps {
  lists: string[][];
  secIdx: number;
  onAddList: (idx: number) => void;
  onRemoveList: (idx: number, listIdx: number) => void;
  onAddListItem: (idx: number, listIdx: number) => void;
  onRemoveListItem: (idx: number, listIdx: number, itemIdx: number) => void;
  onUpdateListItem: (idx: number, listIdx: number, itemIdx: number, value: string) => void;
}

function ListsSection({
  lists,
  secIdx,
  onAddList,
  onRemoveList,
  onAddListItem,
  onRemoveListItem,
  onUpdateListItem,
}: ListsSectionProps) {
  return (
    <div className={styles.listsSection}>
      <div className={styles.subSectionHeader}>
        <label className={styles.subLabel}>Lists</label>
        <button
          onClick={() => onAddList(secIdx)}
          className={styles.addTinyButton}
        >
          Add List
        </button>
      </div>
      {lists.map((list: string[], listIdx: number) => (
        <div key={listIdx} className={styles.listContainer}>
          <div className={styles.listHeader}>
            <label className={styles.listLabel}>List {listIdx + 1}</label>
            <button
              onClick={() => onRemoveList(secIdx, listIdx)}
              className={styles.removeMicroButton}
            >
              Remove
            </button>
          </div>
          {list.map((item: string, itemIdx: number) => (
            <div key={itemIdx} className={styles.listItemRow}>
              <TextInput
                value={item}
                onChange={value => onUpdateListItem(secIdx, listIdx, itemIdx, value)}
                placeholder={`List item ${itemIdx + 1}`}
                className={styles.listItemInput}
              />
              <button
                onClick={() => onRemoveListItem(secIdx, listIdx, itemIdx)}
                className={styles.removeTinyButton}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddListItem(secIdx, listIdx)}
            className={styles.addTinyButton}
          >
            + Add Item
          </button>
        </div>
      ))}
    </div>
  );
}

interface DisclaimerSectionProps {
  disclaimer?: {
    title?: string;
    text?: string;
  };
  secIdx: number;
  onUpdateDisclaimer: (idx: number, field: 'title' | 'text', value: string) => void;
  onRemoveDisclaimer: (idx: number) => void;
}

function DisclaimerSection({
  disclaimer,
  secIdx,
  onUpdateDisclaimer,
  onRemoveDisclaimer,
}: DisclaimerSectionProps) {
  const hasContent = disclaimer?.title || disclaimer?.text;

  return (
    <div className={styles.disclaimerSection}>
      <FormField label="Disclaimer (Optional)">
        <TextInput
          value={disclaimer?.title || ''}
          onChange={value => onUpdateDisclaimer(secIdx, 'title', value)}
          placeholder="Disclaimer title"
        />
        <TextAreaInput
          value={disclaimer?.text || ''}
          onChange={value => onUpdateDisclaimer(secIdx, 'text', value)}
          rows={3}
          placeholder="Disclaimer text"
        />
        {hasContent && (
          <button
            onClick={() => onRemoveDisclaimer(secIdx)}
            className={styles.removeTinyButton}
          >
            Remove Disclaimer
          </button>
        )}
      </FormField>
    </div>
  );
}

interface ContactInfoSectionProps {
  contactInfo?: {
    email?: string;
    address?: string;
  };
  secIdx: number;
  onUpdateContactInfo: (idx: number, field: 'email' | 'address', value: string) => void;
  onRemoveContactInfo: (idx: number) => void;
}

function ContactInfoSection({
  contactInfo,
  secIdx,
  onUpdateContactInfo,
  onRemoveContactInfo,
}: ContactInfoSectionProps) {
  const hasContent = contactInfo?.email || contactInfo?.address;

  return (
    <div className={styles.contactInfoSection}>
      <FormField label="Contact Info (Optional)">
        <TextInput
          type="email"
          value={contactInfo?.email || ''}
          onChange={value => onUpdateContactInfo(secIdx, 'email', value)}
          placeholder="Email address"
        />
        <TextInput
          value={contactInfo?.address || ''}
          onChange={value => onUpdateContactInfo(secIdx, 'address', value)}
          placeholder="Physical address"
        />
        {hasContent && (
          <button
            onClick={() => onRemoveContactInfo(secIdx)}
            className={styles.removeTinyButton}
          >
            Remove Contact Info
          </button>
        )}
      </FormField>
    </div>
  );
}

interface PolicySectionItemProps {
  section: PolicySection;
  secIdx: number;
  sectionType: string;
  onUpdateTitle: (idx: number, value: string) => void;
  onRemove: (idx: number) => void;
  onAddParagraph: (idx: number) => void;
  onRemoveParagraph: (idx: number, paraIdx: number) => void;
  onUpdateParagraph: (idx: number, paraIdx: number, value: string) => void;
  onAddList: (idx: number) => void;
  onRemoveList: (idx: number, listIdx: number) => void;
  onAddListItem: (idx: number, listIdx: number) => void;
  onRemoveListItem: (idx: number, listIdx: number, itemIdx: number) => void;
  onUpdateListItem: (idx: number, listIdx: number, itemIdx: number, value: string) => void;
  onUpdateDisclaimer: (idx: number, field: 'title' | 'text', value: string) => void;
  onRemoveDisclaimer: (idx: number) => void;
  onUpdateContactInfo: (idx: number, field: 'email' | 'address', value: string) => void;
  onRemoveContactInfo: (idx: number) => void;
}

function PolicySectionItem({
  section: sec,
  secIdx,
  sectionType,
  onUpdateTitle,
  onRemove,
  onAddParagraph,
  onRemoveParagraph,
  onUpdateParagraph,
  onAddList,
  onRemoveList,
  onAddListItem,
  onRemoveListItem,
  onUpdateListItem,
  onUpdateDisclaimer,
  onRemoveDisclaimer,
  onUpdateContactInfo,
  onRemoveContactInfo
}: PolicySectionItemProps) {
  return (
    <div className={styles.sectionItem}>
      <div className={styles.sectionItemHeader}>
        <h4 className={styles.sectionItemTitle}>Section {secIdx + 1}</h4>
        <button
          onClick={() => onRemove(secIdx)}
          className={styles.removeTinyButton}
        >
          Remove
        </button>
      </div>

      <FormField label="Title">
        <TextInput
          value={sec.title || ''}
          onChange={value => onUpdateTitle(secIdx, value)}
          placeholder="Section title"
        />
      </FormField>

      <ParagraphsSection
        paragraphs={sec.paragraphs || []}
        secIdx={secIdx}
        onAddParagraph={onAddParagraph}
        onRemoveParagraph={onRemoveParagraph}
        onUpdateParagraph={onUpdateParagraph}
      />

      <ListsSection
        lists={sec.lists || []}
        secIdx={secIdx}
        onAddList={onAddList}
        onRemoveList={onRemoveList}
        onAddListItem={onAddListItem}
        onRemoveListItem={onRemoveListItem}
        onUpdateListItem={onUpdateListItem}
      />

      {sectionType === 'terms' && (
        <DisclaimerSection
          disclaimer={sec.disclaimer}
          secIdx={secIdx}
          onUpdateDisclaimer={onUpdateDisclaimer}
          onRemoveDisclaimer={onRemoveDisclaimer}
        />
      )}

      <ContactInfoSection
        contactInfo={sec.contactInfo}
        secIdx={secIdx}
        onUpdateContactInfo={onUpdateContactInfo}
        onRemoveContactInfo={onRemoveContactInfo}
      />
    </div>
  );
}

interface IntroSectionProps {
  introText: string[];
  onAddParagraph: () => void;
  onRemoveParagraph: (idx: number) => void;
  onUpdateParagraph: (idx: number, value: string) => void;
}

function IntroSection({
  introText,
  onAddParagraph,
  onRemoveParagraph,
  onUpdateParagraph,
}: IntroSectionProps) {
  return (
    <div className={styles.introSection}>
      <div className={styles.sectionHeader}>
        <label className={styles.sectionLabel}>
          Intro Text {introText.length > 0 && (
            <span className={styles.count}>({introText.length} paragraph{introText.length !== 1 ? 's' : ''})</span>
          )}
        </label>
        <button onClick={onAddParagraph} className={styles.addSmallButton}>
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
              onChange={value => onUpdateParagraph(idx, value)}
              rows={3}
              placeholder="Enter intro paragraph..."
            />
            <button
              onClick={() => onRemoveParagraph(idx)}
              className={styles.removeSmallButton}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SectionsContainerProps {
  sections: PolicySection[];
  sectionType: string;
  onAddSection: () => void;
  onUpdateTitle: (idx: number, value: string) => void;
  onRemoveSection: (idx: number) => void;
  onAddParagraph: (idx: number) => void;
  onRemoveParagraph: (idx: number, paraIdx: number) => void;
  onUpdateParagraph: (idx: number, paraIdx: number, value: string) => void;
  onAddList: (idx: number) => void;
  onRemoveList: (idx: number, listIdx: number) => void;
  onAddListItem: (idx: number, listIdx: number) => void;
  onRemoveListItem: (idx: number, listIdx: number, itemIdx: number) => void;
  onUpdateListItem: (idx: number, listIdx: number, itemIdx: number, value: string) => void;
  onUpdateDisclaimer: (idx: number, field: 'title' | 'text', value: string) => void;
  onRemoveDisclaimer: (idx: number) => void;
  onUpdateContactInfo: (idx: number, field: 'email' | 'address', value: string) => void;
  onRemoveContactInfo: (idx: number) => void;
}

function SectionsContainer({
  sections,
  sectionType,
  onAddSection,
  onUpdateTitle,
  onRemoveSection,
  onAddParagraph,
  onRemoveParagraph,
  onUpdateParagraph,
  onAddList,
  onRemoveList,
  onAddListItem,
  onRemoveListItem,
  onUpdateListItem,
  onUpdateDisclaimer,
  onRemoveDisclaimer,
  onUpdateContactInfo,
  onRemoveContactInfo,
}: SectionsContainerProps) {
  return (
    <div className={styles.sectionsContainer}>
      <div className={styles.sectionHeader}>
        <label className={styles.sectionLabel}>
          Sections {sections.length > 0 && (
            <span className={styles.count}>({sections.length} section{sections.length !== 1 ? 's' : ''})</span>
          )}
        </label>
        <button onClick={onAddSection} className={styles.addButton}>
          Add Section
        </button>
      </div>
      {sections.length === 0 && (
        <div className={styles.emptySubState}>
          No sections yet. Click "Add Section" to add one, or check the "Current (server)" JSON below to see what data exists.
        </div>
      )}
      {sections.map((sec: PolicySection, secIdx: number) => (
        <PolicySectionItem
          key={secIdx}
          section={sec}
          secIdx={secIdx}
          sectionType={sectionType}
          onUpdateTitle={onUpdateTitle}
          onRemove={onRemoveSection}
          onAddParagraph={onAddParagraph}
          onRemoveParagraph={onRemoveParagraph}
          onUpdateParagraph={onUpdateParagraph}
          onAddList={onAddList}
          onRemoveList={onRemoveList}
          onAddListItem={onAddListItem}
          onRemoveListItem={onRemoveListItem}
          onUpdateListItem={onUpdateListItem}
          onUpdateDisclaimer={onUpdateDisclaimer}
          onRemoveDisclaimer={onRemoveDisclaimer}
          onUpdateContactInfo={onUpdateContactInfo}
          onRemoveContactInfo={onRemoveContactInfo}
        />
      ))}
    </div>
  );
}

export function PrivacyPolicyTermsEditor({ 
  data, 
  setData,
  section
}: PrivacyPolicyTermsEditorProps) {
  const introText = getArrayValue<string>(data, 'introText');
  const sections = getArrayValue<PolicySection>(data, 'sections');

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
    if (updated[secIdx]?.lists) {
      updated[secIdx].lists.splice(listIdx, 1);
    }
    setData({ ...data, sections: updated });
  };

  const addListItem = (secIdx: number, listIdx: number) => {
    const updated = [...sections];
    if (updated[secIdx]?.lists?.[listIdx]) {
      updated[secIdx].lists[listIdx].push('');
    }
    setData({ ...data, sections: updated });
  };

  const removeListItem = (secIdx: number, listIdx: number, itemIdx: number) => {
    const updated = [...sections];
    if (updated[secIdx]?.lists?.[listIdx]) {
      updated[secIdx].lists[listIdx].splice(itemIdx, 1);
    }
    setData({ ...data, sections: updated });
  };

  const updateListItem = (secIdx: number, listIdx: number, itemIdx: number, value: string) => {
    const updated = [...sections];
    if (updated[secIdx]?.lists?.[listIdx]?.[itemIdx] !== undefined) {
      updated[secIdx].lists[listIdx][itemIdx] = value;
    }
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

  const isEmpty = sections.length === 0 && introText.length === 0;
  const pageTitlePlaceholder = section === 'privacyPolicy' ? 'Privacy Policy' : 'Terms of Service';

  return (
    <>
      {isEmpty && (
        <div className={styles.emptyState}>
          No content loaded. If you have existing content, try clicking "Reload current" or check the JSON view below.
        </div>
      )}

      <FormField label="Page Title">
        <TextInput
          value={getStringValue(data, 'pageTitle')}
          onChange={value => setData({ ...data, pageTitle: value })}
          placeholder={pageTitlePlaceholder}
        />
      </FormField>

      <FormField label="Last Updated">
        <TextInput
          value={getStringValue(data, 'lastUpdated')}
          onChange={value => setData({ ...data, lastUpdated: value })}
          placeholder="October 11th, 2025"
        />
      </FormField>

      <IntroSection
        introText={introText}
        onAddParagraph={addIntroParagraph}
        onRemoveParagraph={removeIntroParagraph}
        onUpdateParagraph={updateIntroParagraph}
      />

      <SectionsContainer
        sections={sections}
        sectionType={section}
        onAddSection={addSection}
        onUpdateTitle={updateSectionTitle}
        onRemoveSection={removeSection}
        onAddParagraph={addSectionParagraph}
        onRemoveParagraph={removeSectionParagraph}
        onUpdateParagraph={updateSectionParagraph}
        onAddList={addSectionList}
        onRemoveList={removeSectionList}
        onAddListItem={addListItem}
        onRemoveListItem={removeListItem}
        onUpdateListItem={updateListItem}
        onUpdateDisclaimer={updateDisclaimer}
        onRemoveDisclaimer={removeDisclaimer}
        onUpdateContactInfo={updateContactInfo}
        onRemoveContactInfo={removeContactInfo}
      />

      <FormField label="Footer Button Text">
        <TextInput
          value={getStringValue(data, 'footerButtonText')}
          onChange={value => setData({ ...data, footerButtonText: value })}
          placeholder="Contact Us"
        />
      </FormField>

      <FormField label="Footer Button Email">
        <TextInput
          type="email"
          value={getStringValue(data, 'footerButtonEmail')}
          onChange={value => setData({ ...data, footerButtonEmail: value })}
          placeholder="hello@hardweyllc.com"
        />
      </FormField>
    </>
  );
}

