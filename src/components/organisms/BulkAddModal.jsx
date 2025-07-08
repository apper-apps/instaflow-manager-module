import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const BulkAddModal = ({ isOpen, onClose, onBulkAdd, accountSources }) => {
  const [formData, setFormData] = useState({
    usernames: '',
    accountSource: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.usernames.trim()) {
      newErrors.usernames = 'Usernames are required';
    }
    if (!formData.accountSource) {
      newErrors.accountSource = 'Account source is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Parse usernames from textarea
    const usernames = formData.usernames
      .split('\n')
      .map(username => username.replace('@', '').trim())
      .filter(username => username.length > 0);

    if (usernames.length === 0) {
      setErrors({ usernames: 'Please enter at least one username' });
      return;
    }

    const result = onBulkAdd(usernames, formData.accountSource);
    
    if (result.success) {
      setFormData({ usernames: '', accountSource: '' });
      setErrors({});
      onClose();
      toast.success(`Successfully added ${result.added} users${result.duplicates > 0 ? ` (${result.duplicates} duplicates skipped)` : ''}`);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Add Users</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Usernames"
            error={errors.usernames}
            required
          >
            <Textarea
              value={formData.usernames}
              onChange={(e) => handleChange('usernames', e.target.value)}
              placeholder="Enter usernames (one per line, @ symbol optional)"
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter one username per line. The @ symbol is optional.
            </p>
          </FormField>

          <FormField
            label="Account Source"
            error={errors.accountSource}
            required
          >
            <Select
              value={formData.accountSource}
              onChange={(e) => handleChange('accountSource', e.target.value)}
            >
              <option value="">Select source</option>
              {accountSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Users
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkAddModal;