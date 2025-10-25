import { useState } from 'react';
import { PriceRecord, User } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceManagementProps {
  priceRecords: PriceRecord[];
  onAddRecord: (record: Omit<PriceRecord, 'id'>) => void;
  currentUser: User;
}

export function PriceManagement({ priceRecords, onAddRecord, currentUser }: PriceManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    product: '',
    oldPrice: '',
    newPrice: '',
    reason: '',
    approvedBy: currentUser.role === 'attendant' ? '' : currentUser.name
  });

  const [filterProduct, setFilterProduct] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.product) {
      toast.error('Please select a product');
      return false;
    }
    
    if (!formData.oldPrice || !formData.newPrice) {
      toast.error('Please enter both old and new prices');
      return false;
    }
    
    if (parseFloat(formData.oldPrice) <= 0 || parseFloat(formData.newPrice) <= 0) {
      toast.error('Prices must be greater than zero');
      return false;
    }
    
    if (!formData.reason) {
      toast.error('Please provide a reason for the price change');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const record: Omit<PriceRecord, 'id'> = {
      date: formData.date,
      product: formData.product,
      oldPrice: parseFloat(formData.oldPrice),
      newPrice: parseFloat(formData.newPrice),
      reason: formData.reason,
      approvedBy: formData.approvedBy || undefined
    };
    
    onAddRecord(record);
    toast.success('Price record added successfully');
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      oldPrice: '',
      newPrice: '',
      reason: '',
      approvedBy: currentUser.role === 'attendant' ? '' : currentUser.name
    });
    setShowForm(false);
  };

  const filteredRecords = priceRecords.filter(record => {
    if (filterProduct !== 'all' && record.product !== filterProduct) return false;
    if (filterDateFrom && record.date < filterDateFrom) return false;
    if (filterDateTo && record.date > filterDateTo) return false;
    return true;
  });

  const getPriceChange = (oldPrice: number, newPrice: number) => {
    const change = newPrice - oldPrice;
    const percentage = ((change / oldPrice) * 100).toFixed(1);
    const isIncrease = change > 0;
    
    return {
      change: Math.abs(change).toFixed(2),
      percentage: Math.abs(parseFloat(percentage)),
      isIncrease
    };
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#001E2B] mb-2">Price Management</h1>
          <p className="text-gray-600">Record and track fuel price changes</p>
        </div>
        {currentUser.role !== 'attendant' && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#00796B] hover:bg-[#005f56] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Price Change
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-[#001E2B] mb-6">Record Price Change</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Change</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={formData.product} onValueChange={(value) => handleInputChange('product', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Kerosene">Kerosene</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldPrice">Old Price (GHS/Litre)</Label>
              <Input
                id="oldPrice"
                type="number"
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) => handleInputChange('oldPrice', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPrice">New Price (GHS/Litre)</Label>
              <Input
                id="newPrice"
                type="number"
                step="0.01"
                value={formData.newPrice}
                onChange={(e) => handleInputChange('newPrice', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Reason for Change</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className="resize-none"
                rows={3}
                placeholder="Explain the reason for this price change..."
              />
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
          </div>

          <div className="flex space-x-4 mt-6">
            <Button
              onClick={handleSubmit}
              className="bg-[#00796B] hover:bg-[#005f56] text-white"
            >
              Save Price Change
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

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#001E2B]">Price History</h2>
          
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
              <Label className="text-sm">Product</Label>
              <Select value={filterProduct} onValueChange={setFilterProduct}>
                <SelectTrigger className="h-10 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Kerosene">Kerosene</SelectItem>
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
                <th className="text-left py-3 px-4 text-[#001E2B]">Product</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Old Price</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">New Price</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Change</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Reason</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Approved By</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => {
                const priceChange = getPriceChange(record.oldPrice, record.newPrice);
                return (
                  <tr key={record.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-700">{record.product}</td>
                    <td className="py-3 px-4 text-gray-700">GHS {record.oldPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-700">GHS {record.newPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center ${priceChange.isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                        {priceChange.isIncrease ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span>
                          {priceChange.isIncrease ? '+' : '-'}GHS {priceChange.change} ({priceChange.percentage}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{record.reason}</td>
                    <td className="py-3 px-4 text-gray-700">{record.approvedBy || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
