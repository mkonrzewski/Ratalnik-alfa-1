import React, { useState, useEffect } from 'react';
import { useLoan } from '../context/LoanContext';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface UpdateLoanFormProps {
  loan: {
    id: string;
    name: string;
    amount: number;
    term: number;
    interestrate: number;
    status: 'active' | 'completed' | 'defaulted';
    first_payment_date?: string;
  };
  onClose: () => void;
}

const UpdateLoanForm: React.FC<UpdateLoanFormProps> = ({ loan, onClose }) => {
  const { updateLoan } = useLoan();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: loan.name || '',
    status: loan.status,
    firstPaymentDate: loan.first_payment_date ? new Date(loan.first_payment_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateLoan(loan.id, {
        name: formData.name,
        status: formData.status,
        first_payment_date: new Date(formData.firstPaymentDate).toISOString(),
      });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Update Loan</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Loan Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Home Loan, Car Purchase, etc."
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="firstPaymentDate" className="block text-sm font-medium text-gray-700">
                  First Payment Date
                </label>
                <input
                  type="date"
                  id="firstPaymentDate"
                  value={formData.firstPaymentDate}
                  onChange={(e) => setFormData({ ...formData, firstPaymentDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isSubmitting}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="defaulted">Defaulted</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLoanForm;