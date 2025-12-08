import { SectionEditorProps } from './types';
import { FormField, TextInput, TextAreaInput } from '../components/FormField';
import styles from './ErrorPageEditor.module.css';

export function ErrorPageEditor({ data, setData }: SectionEditorProps) {
  return (
    <>
      {/* 404 Error Page */}
      <div className={styles.errorSection}>
        <h4 className={styles.sectionTitle}>404 Error Page</h4>
        <FormField label="Title">
          <TextInput
            value={data.error404?.title || ''}
            onChange={value => setData({ 
              ...data, 
              error404: { ...(data.error404 || {}), title: value } 
            })}
            placeholder="404 NOT FOUND"
          />
        </FormField>
        <FormField label="Description">
          <TextAreaInput
            value={data.error404?.description || ''}
            onChange={value => setData({ 
              ...data, 
              error404: { ...(data.error404 || {}), description: value } 
            })}
            rows={3}
            placeholder="You dive too deep so you discovered an unexplored place..."
          />
        </FormField>
      </div>

      {/* 500 Error Page */}
      <div className={styles.errorSection}>
        <h4 className={styles.sectionTitle}>500 Error Page</h4>
        <FormField label="Title">
          <TextInput
            value={data.error500?.title || ''}
            onChange={value => setData({ 
              ...data, 
              error500: { ...(data.error500 || {}), title: value } 
            })}
            placeholder="500 SERVER ERROR"
          />
        </FormField>
        <FormField label="Description">
          <TextAreaInput
            value={data.error500?.description || ''}
            onChange={value => setData({ 
              ...data, 
              error500: { ...(data.error500 || {}), description: value } 
            })}
            rows={3}
            placeholder="Oops! Something went wrong on our end..."
          />
        </FormField>
      </div>

      {/* 403 Error Page */}
      <div className={styles.errorSection}>
        <h4 className={styles.sectionTitle}>403 Error Page</h4>
        <FormField label="Title">
          <TextInput
            value={data.error403?.title || ''}
            onChange={value => setData({ 
              ...data, 
              error403: { ...(data.error403 || {}), title: value } 
            })}
            placeholder="403 FORBIDDEN"
          />
        </FormField>
        <FormField label="Description">
          <TextAreaInput
            value={data.error403?.description || ''}
            onChange={value => setData({ 
              ...data, 
              error403: { ...(data.error403 || {}), description: value } 
            })}
            rows={3}
            placeholder="Access denied. You don't have permission to view this page."
          />
        </FormField>
      </div>

      {/* Default Error Page */}
      <div className={styles.errorSection}>
        <h4 className={styles.sectionTitle}>Default Error Page</h4>
        <FormField label="Title">
          <TextInput
            value={data.defaultError?.title || ''}
            onChange={value => setData({ 
              ...data, 
              defaultError: { ...(data.defaultError || {}), title: value } 
            })}
            placeholder="ERROR"
          />
        </FormField>
        <FormField label="Description">
          <TextAreaInput
            value={data.defaultError?.description || ''}
            onChange={value => setData({ 
              ...data, 
              defaultError: { ...(data.defaultError || {}), description: value } 
            })}
            rows={3}
            placeholder="An unexpected error occurred. Please try again later."
          />
        </FormField>
      </div>

      {/* Back Button */}
      <FormField label="Back Button Text">
        <TextInput
          value={data.backButtonText || ''}
          onChange={value => setData({ ...data, backButtonText: value })}
          placeholder="Back to Home"
        />
      </FormField>

      {/* Background Pattern Image */}
      <FormField label="Background Pattern Image URL">
        <TextInput
          value={data.backgroundPatternImage || ''}
          onChange={value => setData({ ...data, backgroundPatternImage: value })}
          placeholder="/assets/img/Green eye.gif"
        />
        {data.backgroundPatternImage && (
          <div className={styles.imagePreview}>
            <img 
              src={data.backgroundPatternImage} 
              alt="Pattern Preview" 
            />
          </div>
        )}
      </FormField>

      {/* Arrow Icon */}
      <FormField label="Arrow Icon URL">
        <TextInput
          value={data.arrowIcon || ''}
          onChange={value => setData({ ...data, arrowIcon: value })}
          placeholder="/assets/svg/arrow-red.svg"
        />
        {data.arrowIcon && (
          <div className={styles.iconPreview}>
            <img 
              src={data.arrowIcon} 
              alt="Arrow Preview" 
            />
          </div>
        )}
      </FormField>
    </>
  );
}

