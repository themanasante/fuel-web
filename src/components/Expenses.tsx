import { useState } from 'react';
import { Expense, User } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Plus, Receipt } from 'lucide-react';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  currentUser: User;
}

export function Expenses({ expenses, onAddExpense, currentUser }: ExpensesProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: '',
    approvedBy: currentUser.role === 'attendant' ? '' : currentUser.name,
    note: ''
  });

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.description) {
      toast.error('Please enter a description');
      return false;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const expense: Omit<Expense, 'id'> = {
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      approvedBy: formData.approvedBy || undefined,
      note: formData.note || undefined
    };
    
    onAddExpense(expense);
    toast.success('Expense recorded successfully');
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      category: '',
      approvedBy: currentUser.role === 'attendant' ? '' : currentUser.name,
      note: ''
    });
    setShowForm(false);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filterCategory !== 'all' && expense.category !== filterCategory) return false;
    if (filterDateFrom && expense.date < filterDateFrom) return false;
    if (filterDateTo && expense.date > filterDateTo) return false;
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#001E2B] mb-2">Expenses</h1>
          <p className="text-gray-600">Record and track daily expenses</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00796B] hover:bg-[#005f56] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Expense
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-[#001E2B] mb-6">Record Expense</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (GHS)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-12"
                placeholder="Brief description of expense"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Salaries">Salaries</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentUser.role !== 'attendant' && (
              <div className="space-y-2">
                <Label htmlFor="approvedBy">Approved By</Label>
                <Input
                  id="approvedBy"
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => handleInputChange('approvedBy', e.target.value)}
                  className="h-12"
                  placeholder="Approver name"
                />
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="resize-none"
                rows={3}
                placeholder="Additional notes or details..."
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button
              onClick={handleSubmit}
              className="bg-[#00796B] hover:bg-[#005f56] text-white"
            >
              Save Expense
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-[#00796B]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Expenses</p>
              <p className="text-[#001E2B] text-3xl">GHS {totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#00796B]/10 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-[#00796B]" />
            </div>
          </div>
        </Card>

        {Object.entries(expensesByCategory).slice(0, 3).map(([category, amount]) => (
          <Card key={category} className="p-6">
            <div>
              <p className="text-gray-600 mb-1">{category}</p>
              <p className="text-[#001E2B] text-2xl">GHS {amount.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-1">
                {((amount / totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#001E2B]">All Expenses</h2>
          
          <div className="flex space-x-4">
            <div className="space-y-2">
              <Label className="text-sm">From Date</Label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">To Date</Label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-10 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Salaries">Salaries</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-[#001E2B]">Date</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Description</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Category</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Amount</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Approved By</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={expense.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 text-gray-700">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700">{expense.description}</td>
                  <td className="py-3 px-4 text-gray-700">{expense.category}</td>
                  <td className="py-3 px-4 text-gray-700">GHS {expense.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{expense.approvedBy || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{expense.note || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300">
                <td colSpan={3} className="py-3 px-4 text-[#001E2B]">Total</td>
                <td className="py-3 px-4 text-[#001E2B]">GHS {totalExpenses.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
