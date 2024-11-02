import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, PiggyBank, Wallet, Lock } from 'lucide-react';
import MetricCard from '../components/MetricCard';

const DemoDashboard: React.FC = () => {
  const navigate = useNavigate();

  const demoLoans = [
    {
      id: '1',
      name: 'Home Mortgage',
      amount: 250000,
      term: 360,
      monthlyinstallment: 1342.05,
      status: 'active',
      first_payment_date: '2023-01-01',
    },
    {
      id: '2',
      name: 'Car Loan',
      amount: 35000,
      term: 60,
      monthlyinstallment: 660.75,
      status: 'active',
      first_payment_date: '2023-03-15',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">LoanManager</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LoanManager</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage all your loans in one place. This is a demo view with sample data.
            Sign in to manage your own loans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Monthly Payments"
            value="$2,002.80"
            icon={Calendar}
          />
          <MetricCard
            title="Total Loans"
            value="2"
            icon={Wallet}
          />
          <MetricCard
            title="Total Amount"
            value="$285,000"
            icon={DollarSign}
          />
          <MetricCard
            title="Average Term"
            value="210 months"
            icon={PiggyBank}
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Sample Loans</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="h-4 w-4 mr-1" />
                Demo Mode
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {demoLoans.map((loan) => (
              <div key={loan.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{loan.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      ${loan.amount.toLocaleString()} • {loan.term} months
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {loan.status}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly Payment</span>
                    <span className="font-medium">${loan.monthlyinstallment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600">
            <Lock className="h-4 w-4 mr-2" />
            Interactive features available after sign in
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoDashboard;