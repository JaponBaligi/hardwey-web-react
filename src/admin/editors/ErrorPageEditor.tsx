import type { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import { getStringValue, getObjectValue } from '../utils/dataHelpers';
import styles from './ErrorPageEditor.module.css';

interface ErrorPageData extends Record<string, unknown> {
  title?: string;
  description?: string;
}

interface ErrorPageSectionProps {
  title: string;
  errorKey: 'error404' | 'error500' | 'error403' | 'defaultError';
  errorData: ErrorPageData | undefined;
  onUpdate: (key: 'error404' | 'error500' | 'error403' | 'defaultError', field: 'title' | 'description', value: string) => void;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
}

function ErrorPageSection({ title, errorKey, errorData, onUpdate, titlePlaceholder, descriptionPlaceholder }: ErrorPageSectionProps) {
  return (
    <div className={styles.errorSection}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <FormField label="Title">
        <TextInput
          value={errorData?.title || ''}
          onChange={value => onUpdate(errorKey, 'title', value)}
          placeholder={titlePlaceholder}
        />
      </FormField>
      <FormField label="Description">
        <TextAreaInput
          value={errorData?.description || ''}
          onChange={value => onUpdate(errorKey, 'description', value)}
          rows={3}
          placeholder={descriptionPlaceholder}
        />
      </FormField>
    </div>
  );
}

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  previewClassName: string;
  alt: string;
}

function ImageField({ label, value, onChange, placeholder, previewClassName, alt }: ImageFieldProps) {
  return (
    <FormField label={label}>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <div className={previewClassName}>
          <img src={value} alt={alt} />
        </div>
      )}
    </FormField>
  );
}

export function ErrorPageEditor({ data, setData }: SectionEditorProps) {
  const updateErrorPage = (key: 'error404' | 'error500' | 'error403' | 'defaultError', field: 'title' | 'description', value: string) => {
    setData({
      ...data,
      [key]: { ...(data[key] || {}), [field]: value }
    });
  };

  const updateSimpleField = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <>
      <ErrorPageSection
        title="404 Error Page"
        errorKey="error404"
        errorData={getObjectValue<ErrorPageData>(data, 'error404', {})}
        onUpdate={updateErrorPage}
        titlePlaceholder="404 NOT FOUND"
        descriptionPlaceholder="You dive too deep so you discovered an unexplored place..."
      />

      <ErrorPageSection
        title="500 Error Page"
        errorKey="error500"
        errorData={getObjectValue<ErrorPageData>(data, 'error500', {})}
        onUpdate={updateErrorPage}
        titlePlaceholder="500 SERVER ERROR"
        descriptionPlaceholder="Oops! Something went wrong on our end..."
      />

      <ErrorPageSection
        title="403 Error Page"
        errorKey="error403"
        errorData={getObjectValue<ErrorPageData>(data, 'error403', {})}
        onUpdate={updateErrorPage}
        titlePlaceholder="403 FORBIDDEN"
        descriptionPlaceholder="Access denied. You don't have permission to view this page."
      />

      <ErrorPageSection
        title="Default Error Page"
        errorKey="defaultError"
        errorData={getObjectValue<ErrorPageData>(data, 'defaultError', {})}
        onUpdate={updateErrorPage}
        titlePlaceholder="ERROR"
        descriptionPlaceholder="An unexpected error occurred. Please try again later."
      />

      <FormField label="Back Button Text">
        <TextInput
          value={getStringValue(data, 'backButtonText')}
          onChange={value => updateSimpleField('backButtonText', value)}
          placeholder="Back to Home"
        />
      </FormField>

      <ImageField
        label="Background Pattern Image URL"
        value={getStringValue(data, 'backgroundPatternImage')}
        onChange={value => updateSimpleField('backgroundPatternImage', value)}
        placeholder="/assets/img/Green eye.gif"
        previewClassName={styles.imagePreview}
        alt="Pattern Preview"
      />

      <ImageField
        label="Arrow Icon URL"
        value={getStringValue(data, 'arrowIcon')}
        onChange={value => updateSimpleField('arrowIcon', value)}
        placeholder="/assets/svg/arrow-red.svg"
        previewClassName={styles.iconPreview}
        alt="Arrow Preview"
      />
    </>
  );
}

