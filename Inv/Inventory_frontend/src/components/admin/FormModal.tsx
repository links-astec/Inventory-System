import React from 'react';
import Modal from './Modal';

interface FormField {
  field: string;
  type: string;
  required?: boolean;
  step?: string;
  placeholder?: string;
  options?: string[];
  rows?: number;
}

interface FormModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  fields: FormField[];
  formData: Record<string, string | number | boolean>;
  onFieldChange: (field: string, value: string) => void;
  primaryTextClass: string;
  primaryBg: string;
  primaryHoverBg: string;
  submitText: string;
}

const FormModal: React.FC<FormModalProps> = ({
  show,
  title,
  onClose,
  onSubmit,
  fields,
  formData,
  onFieldChange,
  primaryTextClass,
  primaryBg,
  primaryHoverBg,
  submitText
}) => {
  return (
    <Modal show={show} title={title} onClose={onClose} primaryTextClass={primaryTextClass}>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(({ field, type, required, step, placeholder, options, rows }) => {
          const fieldValue = formData[field];
          const stringValue = typeof fieldValue === 'boolean' ? fieldValue.toString() : (fieldValue || '').toString();
          
          if (type === 'select' && options) {
            return (
              <select
                key={field}
                value={stringValue}
                onChange={e => onFieldChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                aria-label={placeholder || field}
                title={placeholder || field}
              >
                {options.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            );
          }
          
          if (type === 'textarea') {
            return (
              <textarea
                key={field}
                placeholder={placeholder || field.charAt(0).toUpperCase() + field.slice(1)}
                value={stringValue}
                onChange={e => onFieldChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={rows || 3}
                aria-label={placeholder || field}
              />
            );
          }

          return (
            <input
              key={field}
              type={type}
              step={step}
              required={required}
              placeholder={placeholder || field.charAt(0).toUpperCase() + field.slice(1)}
              value={stringValue}
              onChange={e => onFieldChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              aria-label={placeholder || field}
            />
          );
        })}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex-1 ${primaryBg} text-white py-2 rounded hover:${primaryHoverBg}`}
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
