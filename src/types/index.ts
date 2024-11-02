export interface User {
  username: string;
  id: string;
  isAuthenticated: boolean;
}

export interface Loan {
  id: string;
  name: string;
  amount: number;
  term: number;
  monthlyinstallment: number;
  totalpaid: number;
  startdate: string;
  first_payment_date?: string;
  status: 'active' | 'completed' | 'defaulted';
  user_id: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}