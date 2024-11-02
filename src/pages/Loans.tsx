import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import LoanForm from '../components/LoanForm';
import UpdateLoanForm from '../components/UpdateLoanForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Wallet, Loader, Calendar, ArrowRight } from 'lucide-react';
import { calculateTotalPaid } from '../utils/loanCalculations';

const Loans: React.FC = () => {
  const navigate = useNavigate();
  const { loans, isLoading, deleteLoan } = useLoan();
  const [showForm, setShowForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; loanId: string | null }>({
    isOpen: false,
    loanId: null,
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteLoan(id);
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your active loans</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </button>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-12">
          <div className="rounded-lg bg-white p-12">
            <Wallet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No loans</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new loan.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Loan
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loans.map((loan) => {
            const totalPaid = calculateTotalPaid(loan);
            const progressPercentage = (totalPaid / (loan.amount)) * 100;
            
            return (
              <div 
                key={loan.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/loans/${loan.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {loan.name || 'Unnamed Loan'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ${loan.amount.toFixed(2)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      loan.status === 'active' ? 'bg-green-100 text-green-800' :
                      loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {loan.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Term</span>
                      </div>
                      <span className="text-sm font-medium">{loan.term} months</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Monthly Payment</span>
                      <span className="text-sm font-medium">
                        ${loan.monthlyinstallment.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Total Paid</span>
                      <span className="text-sm font-medium">
                        ${totalPaid.toFixed(2)}
                      </span>
                    </div>

                    <div className="relative pt-2">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                        <div
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking buttons
                        setSelectedLoan(loan);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking buttons
                        setDeleteModal({ isOpen: true, loanId: loan.id });
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <LoanForm onClose={() => setShowForm(false)} />}
      {selectedLoan && (
        <UpdateLoanForm
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
        />
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, loanId: null })}
        onConfirm={() => {
          if (deleteModal.loanId) {
            handleDelete(deleteModal.loanId);
          }
        }}
        title="Delete Loan"
        message="Are you sure you want to delete this loan? This action cannot be undone."
      />
    </div>
  );
};

export default Loans;