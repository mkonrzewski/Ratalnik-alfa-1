import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Percent, CreditCard, Download } from 'lucide-react';
import { format, addMonths, differenceInDays } from 'date-fns';
import { exportRepaymentSchedule } from '../utils/pdfExport';
import toast from 'react-hot-toast';

interface PaymentSchedule {
  paymentDate: Date;
  amount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: 'paid' | 'upcoming' | 'pending';
}

const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loans } = useLoan();
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const rowsPerPage = 12;

  const loan = loans.find(l => l.id === id);
  const totalPages = Math.ceil((loan?.term || 0) / rowsPerPage);

  useEffect(() => {
    if (loan && loan.first_payment_date) {
      const schedule: PaymentSchedule[] = [];
      let remainingBalance = loan.amount;
      const monthlyInterest = (loan.interestrate / 100) / 12;

      for (let i = 0; i < loan.term; i++) {
        const paymentDate = addMonths(new Date(loan.first_payment_date), i);
        const interest = remainingBalance * monthlyInterest;
        const principal = loan.monthlyinstallment - interest;
        remainingBalance -= principal;

        const today = new Date();
        let status: 'paid' | 'upcoming' | 'pending' = 'pending';
        
        if (differenceInDays(paymentDate, today) < 0) {
          status = 'paid';
        } else if (differenceInDays(paymentDate, today) <= 30) {
          status = 'upcoming';
        }

        schedule.push({
          paymentDate,
          amount: loan.monthlyinstallment,
          principal,
          interest,
          remainingBalance: Math.max(0, remainingBalance),
          status
        });
      }

      setPaymentSchedule(schedule);
    }
  }, [loan]);

  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 1;
    const range: (number | string)[] = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    
    return range;
  };

  const handleExportPDF = () => {
    try {
      if (!loan) return;
      exportRepaymentSchedule(loan, paymentSchedule);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (!loan) {
    return <div className="p-6">Loan not found</div>;
  }

  const completedInstallments = paymentSchedule.filter(p => p.status === 'paid').length;
  const nextPayment = paymentSchedule.find(p => p.status === 'upcoming');
  const daysUntilNextPayment = nextPayment 
    ? differenceInDays(nextPayment.paymentDate, new Date())
    : 0;

  const currentPageItems = paymentSchedule.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{loan.name}</h1>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-indigo-600">
                Loan Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {((completedInstallments / loan.term) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
            <div
              style={{ width: `${(completedInstallments / loan.term) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
            />
          </div>
          <div className="text-sm text-gray-600">
            {completedInstallments} of {loan.term} installments completed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Days until next payment</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{daysUntilNextPayment}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Remaining balance</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${(loan.amount - (completedInstallments * loan.monthlyinstallment)).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Percent className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Interest rate</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{loan.interestrate}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly payment</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">${loan.monthlyinstallment.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Repayment Schedule</h2>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Principal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPageItems.map((payment, index) => (
                <tr key={index} className={payment.status === 'upcoming' ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(payment.paymentDate, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.principal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.interest.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.remainingBalance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {getPaginationRange(currentPage, totalPages).map((page, index) => (
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;