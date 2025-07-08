import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';

const AddUserModal = ({ isOpen, onClose, onAdd, accountSources }) => {
  const [formData, setFormData] = useState({
    username: '',
    accountSource: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.accountSource) {
      newErrors.accountSource = 'Account source is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Remove @ symbol if present
    const cleanUsername = formData.username.replace('@', '');
    
    const success = onAdd({
      username: cleanUsername,
      accountSource: formData.accountSource
    });

    if (success) {
      setFormData({ username: '', accountSource: '' });
      setErrors({});
      onClose();
      toast.success('User added successfully');
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
          <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Enter username (without @)"
            error={errors.username}
            required
          />

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
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;