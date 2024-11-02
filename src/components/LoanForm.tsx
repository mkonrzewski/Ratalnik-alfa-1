import React, { useState, useEffect } from 'react';
import { useLoan } from '../context/LoanContext';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

type LoanType = 'mortgage' | 'cash' | 'installment';

interface LoanFormProps {
  onClose: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onClose }) => {
  const { addLoan } = useLoan();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cash' as LoanType,
    installmentAmount: '',
    term: '',
    interestrate: '',
    firstPaymentDate: new Date().toISOString().split('T')[0], // Set default to today
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
      const amount = parseFloat(formData.installmentAmount);
      const term = parseInt(formData.term);
      const interestrate = parseFloat(formData.interestrate);

      if (isNaN(amount) || isNaN(term) || isNaN(interestrate)) {
        throw new Error('Please enter valid numbers');
      }

      if (amount <= 0 || term <= 0 || interestrate <= 0) {
        throw new Error('Values must be greater than 0');
      }

      // Convert years to months for mortgage loans
      const termInMonths = formData.type === 'mortgage' ? term * 12 : term;
      const monthlyRate = interestrate / 100 / 12;
      const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                            (Math.pow(1 + monthlyRate, termInMonths) - 1);

      const newLoan = {
        name: formData.name,
        type: formData.type,
        amount,
        term: termInMonths,
        interestrate,
        monthlyinstallment: monthlyPayment,
        totalpaid: 0,
        status: 'active' as const,
        startdate: new Date().toISOString(),
        first_payment_date: new Date(formData.firstPaymentDate).toISOString(),
      };

      await addLoan(newLoan);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTermLabel = () => {
    switch (formData.type) {
      case 'mortgage':
        return 'Term (years)';
      case 'cash':
        return 'Term (months)';
      case 'installment':
        return 'Number of Installments';
      default:
        return 'Term';
    }
  };

  return (
    <div className="fixed inset-0 z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">New Loan</h3>
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
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Loan Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LoanType })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isSubmitting}
                >
                  <option value="mortgage">Mortgage Loan</option>
                  <option value="cash">Cash Loan</option>
                  <option value="installment">Installment Purchase</option>
                </select>
              </div>

              <div>
                <label htmlFor="installmentAmount" className="block text-sm font-medium text-gray-700">
                  Installment Amount ($)
                </label>
                <input
                  type="number"
                  id="installmentAmount"
                  value={formData.installmentAmount}
                  onChange={(e) => setFormData({ ...formData, installmentAmount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="10000"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                  {getTermLabel()}
                </label>
                <input
                  type="number"
                  id="term"
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={formData.type === 'mortgage' ? '30' : '12'}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="interestrate" className="block text-sm font-medium text-gray-700">
                  Interest Rate (% per year)
                </label>
                <input
                  type="number"
                  id="interestrate"
                  value={formData.interestrate}
                  onChange={(e) => setFormData({ ...formData, interestrate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="5.5"
                  step="0.1"
                  required
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
                  {isSubmitting ? 'Creating...' : 'Create Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanForm;