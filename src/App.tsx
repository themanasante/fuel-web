import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { DailyOperations } from './components/DailyOperations';
import { PriceManagement } from './components/PriceManagement';
import { TanksMeters } from './components/TanksMeters';
import { Expenses } from './components/Expenses';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'attendant' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DailyReading {
  id: string;
  date: string;
  pumpId: string;
  openingMeter: number;
  closingMeter: number;
  litresSold: number;
  unitPrice: number;
  totalSales: number;
  operatorName: string;
  notes?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedBy?: string;
}

export interface PriceRecord {
  id: string;
  date: string;
  product: string;
  oldPrice: number;
  newPrice: number;
  reason: string;
  approvedBy?: string;
}

export interface TankReading {
  id: string;
  date: string;
  tankId: string;
  openingReading: number;
  closingReading: number;
  fuelReceived: number;
  balance: number;
  source?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  approvedBy?: string;
  note?: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Mock data storage
  const [dailyReadings, setDailyReadings] = useState<DailyReading[]>([
    {
      id: '1',
      date: '2025-10-20',
      pumpId: 'Pump 1',
      openingMeter: 10000,
      closingMeter: 10500,
      litresSold: 500,
      unitPrice: 15.50,
      totalSales: 7750,
      operatorName: 'John Doe',
      status: 'approved',
      approvedBy: 'Manager Smith'
    },
    {
      id: '2',
      date: '2025-10-19',
      pumpId: 'Pump 2',
      openingMeter: 8000,
      closingMeter: 8350,
      litresSold: 350,
      unitPrice: 15.50,
      totalSales: 5425,
      operatorName: 'Jane Smith',
      status: 'approved',
      approvedBy: 'Manager Smith'
    }
  ]);

  const [priceRecords, setPriceRecords] = useState<PriceRecord[]>([
    {
      id: '1',
      date: '2025-10-15',
      product: 'Petrol',
      oldPrice: 15.00,
      newPrice: 15.50,
      reason: 'Market price increase',
      approvedBy: 'Manager Smith'
    },
    {
      id: '2',
      date: '2025-10-10',
      product: 'Diesel',
      oldPrice: 14.50,
      newPrice: 15.00,
      reason: 'Supplier price adjustment',
      approvedBy: 'Manager Smith'
    }
  ]);

  const [tankReadings, setTankReadings] = useState<TankReading[]>([
    {
      id: '1',
      date: '2025-10-20',
      tankId: 'Tank A',
      openingReading: 5000,
      closingReading: 4500,
      fuelReceived: 0,
      balance: 4500,
      source: ''
    },
    {
      id: '2',
      date: '2025-10-19',
      tankId: 'Tank A',
      openingReading: 3000,
      closingReading: 5000,
      fuelReceived: 2000,
      balance: 5000,
      source: 'Depot Refill - Truck #5432'
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2025-10-20',
      description: 'Generator fuel',
      amount: 250,
      category: 'Operations',
      approvedBy: 'Manager Smith'
    },
    {
      id: '2',
      date: '2025-10-19',
      description: 'Pump maintenance',
      amount: 500,
      category: 'Maintenance',
      approvedBy: 'Manager Smith'
    }
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would validate against backend
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'attendant'
    };
    setCurrentUser(mockUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const addDailyReading = (reading: Omit<DailyReading, 'id'>) => {
    const newReading: DailyReading = {
      ...reading,
      id: Date.now().toString()
    };
    setDailyReadings([newReading, ...dailyReadings]);
  };

  const updateDailyReading = (id: string, updates: Partial<DailyReading>) => {
    setDailyReadings(dailyReadings.map(reading => 
      reading.id === id ? { ...reading, ...updates } : reading
    ));
  };

  const addPriceRecord = (record: Omit<PriceRecord, 'id'>) => {
    const newRecord: PriceRecord = {
      ...record,
      id: Date.now().toString()
    };
    setPriceRecords([newRecord, ...priceRecords]);
  };

  const addTankReading = (reading: Omit<TankReading, 'id'>) => {
    const newReading: TankReading = {
      ...reading,
      id: Date.now().toString()
    };
    setTankReadings([newReading, ...tankReadings]);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses([newExpense, ...expenses]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          currentUser={currentUser}
          onLogout={handleLogout}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-auto">
          {currentPage === 'dashboard' && (
            <Dashboard 
              dailyReadings={dailyReadings}
              expenses={expenses}
              tankReadings={tankReadings}
              onNavigate={setCurrentPage}
            />
          )}
          {currentPage === 'daily-operations' && (
            <DailyOperations 
              dailyReadings={dailyReadings}
              onAddReading={addDailyReading}
              onUpdateReading={updateDailyReading}
              currentUser={currentUser}
            />
          )}
          {currentPage === 'price-management' && (
            <PriceManagement 
              priceRecords={priceRecords}
              onAddRecord={addPriceRecord}
              currentUser={currentUser}
            />
          )}
          {currentPage === 'tanks-meters' && (
            <TanksMeters 
              tankReadings={tankReadings}
              onAddReading={addTankReading}
            />
          )}
          {currentPage === 'expenses' && (
            <Expenses 
              expenses={expenses}
              onAddExpense={addExpense}
              currentUser={currentUser}
            />
          )}
          {currentPage === 'reports' && (
            <Reports 
              dailyReadings={dailyReadings}
              priceRecords={priceRecords}
              tankReadings={tankReadings}
              expenses={expenses}
            />
          )}
          {currentPage === 'settings' && (
            <Settings currentUser={currentUser} />
          )}
        </main>
      </div>
      <Toaster />
    </>
  );
}

export default App;
