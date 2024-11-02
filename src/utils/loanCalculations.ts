import { Loan } from '../types';
import { addMonths, differenceInDays, isBefore, isAfter } from 'date-fns';

interface PaymentScheduleItem {
  date: string;
  amount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: 'paid' | 'pending';
  isUpcoming: boolean;
}

export const calculateTotalPaid = (loan: Loan): number => {
  if (!loan.first_payment_date) return 0;

  const firstPaymentDate = new Date(loan.first_payment_date);
  const today = new Date();
  
  // Calculate months between first payment and today
  const months = (today.getFullYear() - firstPaymentDate.getFullYear()) * 12 +
    (today.getMonth() - firstPaymentDate.getMonth());
  
  // If we haven't reached the first payment date yet
  if (months < 0) return 0;
  
  // Calculate total payments made (not exceeding the loan term)
  const paymentsCount = Math.min(months + 1, loan.term);
  
  return paymentsCount * loan.monthlyinstallment;
};

export const calculateDaysUntilNextPayment = (loan: Loan): number => {
  if (!loan.first_payment_date) return 0;

  const today = new Date();
  const firstPayment = new Date(loan.first_payment_date);
  
  // Find the next payment date
  let nextPayment = firstPayment;
  while (isBefore(nextPayment, today)) {
    nextPayment = addMonths(nextPayment, 1);
  }
  
  return differenceInDays(nextPayment, today);
};

export const calculateAmortizationSchedule = (loan: Loan): PaymentScheduleItem[] => {
  if (!loan.first_payment_date) return [];

  const schedule: PaymentScheduleItem[] = [];
  const monthlyRate = loan.interestrate / 100 / 12;
  let remainingBalance = loan.amount;
  const today = new Date();
  
  for (let i = 0; i < loan.term; i++) {
    const paymentDate = addMonths(new Date(loan.first_payment_date), i);
    const interest = remainingBalance * monthlyRate;
    const principal = loan.monthlyinstallment - interest;
    remainingBalance -= principal;

    schedule.push({
      date: paymentDate.toISOString(),
      amount: loan.monthlyinstallment,
      principal,
      interest,
      remainingBalance: Math.max(0, remainingBalance),
      status: isBefore(paymentDate, today) ? 'paid' : 'pending',
      isUpcoming: isAfter(paymentDate, today) && 
                 isBefore(paymentDate, addMonths(today, 1))
    });
  }

  return schedule;
};