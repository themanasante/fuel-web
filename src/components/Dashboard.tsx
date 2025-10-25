import { DailyReading, Expense, TankReading } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, Fuel, Receipt, BarChart3, FileText, DollarSign } from 'lucide-react';

interface DashboardProps {
  dailyReadings: DailyReading[];
  expenses: Expense[];
  tankReadings: TankReading[];
  onNavigate: (page: string) => void;
}

export function Dashboard({ dailyReadings, expenses, tankReadings, onNavigate }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's stats
  const todayReadings = dailyReadings.filter(r => r.date === today);
  const todayLitresSold = todayReadings.reduce((sum, r) => sum + r.litresSold, 0);
  const todaySales = todayReadings.reduce((sum, r) => sum + r.totalSales, 0);
  const todayExpenses = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
  const latestTank = tankReadings.length > 0 ? tankReadings[0] : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#001E2B] mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of today's operations - {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-[#00796B]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 mb-1">Litres Sold Today</p>
              <p className="text-[#001E2B] text-3xl">{todayLitresSold.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#00796B]/10 flex items-center justify-center">
              <Fuel className="w-6 h-6 text-[#00796B]" />
            </div>
          </div>
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>From {todayReadings.length} pumps</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-[#FFD54F]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 mb-1">Total Sales</p>
              <p className="text-[#001E2B] text-3xl">GHS {todaySales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FFD54F]/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#FFD54F]" />
            </div>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Average: GHS {todayReadings.length > 0 ? (todaySales / todayReadings.length).toFixed(2) : '0.00'} per pump</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 mb-1">Expenses Today</p>
              <p className="text-[#001E2B] text-3xl">GHS {todayExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span>{expenses.filter(e => e.date === today).length} transactions</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 mb-1">Current Tank Level</p>
              <p className="text-[#001E2B] text-3xl">{latestTank ? latestTank.balance.toLocaleString() : '0'}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Litres in {latestTank ? latestTank.tankId : 'storage'}</span>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-[#001E2B] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => onNavigate('daily-operations')}
            className="h-20 bg-[#00796B] hover:bg-[#005f56] text-white flex items-center justify-center space-x-3"
          >
            <FileText className="w-6 h-6" />
            <span>Enter Daily Readings</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('expenses')}
            className="h-20 bg-[#001E2B] hover:bg-[#001820] text-white flex items-center justify-center space-x-3"
          >
            <Receipt className="w-6 h-6" />
            <span>Log Expense</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('reports')}
            className="h-20 bg-[#FFD54F] hover:bg-[#ffc933] text-[#001E2B] flex items-center justify-center space-x-3"
          >
            <BarChart3 className="w-6 h-6" />
            <span>View Reports</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-[#001E2B] mb-4">Recent Readings</h3>
          <div className="space-y-3">
            {dailyReadings.slice(0, 5).map((reading) => (
              <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[#001E2B]">{reading.pumpId}</p>
                  <p className="text-gray-600 text-sm">{new Date(reading.date).toLocaleDateString()} - {reading.operatorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#001E2B]">{reading.litresSold} L</p>
                  <p className="text-gray-600 text-sm">GHS {reading.totalSales}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-[#001E2B] mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[#001E2B]">{expense.description}</p>
                  <p className="text-gray-600 text-sm">{new Date(expense.date).toLocaleDateString()} - {expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#001E2B]">GHS {expense.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
