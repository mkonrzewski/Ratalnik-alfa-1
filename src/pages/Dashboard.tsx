import React from 'react';
import { useLoan } from '../context/LoanContext';
import MetricCard from '../components/MetricCard';
import { DollarSign, Calendar, PiggyBank, Wallet } from 'lucide-react';
import { calculateTotalPaid } from '../utils/loanCalculations';

const Dashboard: React.FC = () => {
  const { loans } = useLoan();

  // Calculate metrics
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalLoans = loans.length;
  const totalAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = activeLoans.reduce((sum, loan) => sum + calculateTotalPaid(loan), 0);
  const monthlyInstallments = activeLoans.reduce((sum, loan) => sum + loan.monthlyinstallment, 0);
  const completionPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your active loan portfolio</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Loan Progress</h2>
          <div className="text-sm text-gray-500">
            ${totalPaid.toFixed(2)} of ${totalAmount.toFixed(2)}
          </div>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
            <div
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{completionPercentage.toFixed(1)}% Complete</span>
            <span>{(100 - completionPercentage).toFixed(1)}% Remaining</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Monthly Payments"
          value={`$${monthlyInstallments.toFixed(2)}`}
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricCard
          title="Total Loans"
          value={totalLoans.toString()}
          icon={Wallet}
        />
        <MetricCard
          title="Total Paid"
          value={`$${totalPaid.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: (totalPaid / totalAmount) * 100, isPositive: true }}
        />
        <MetricCard
          title="Balance Due"
          value={`$${(totalAmount - totalPaid).toFixed(2)}`}
          icon={PiggyBank}
        />
      </div>
    </div>
  );
};

export default Dashboard;