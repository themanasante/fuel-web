import { useState } from 'react';
import { DailyReading, User } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Plus, Check, X, Eye } from 'lucide-react';

interface DailyOperationsProps {
  dailyReadings: DailyReading[];
  onAddReading: (reading: Omit<DailyReading, 'id'>) => void;
  onUpdateReading: (id: string, updates: Partial<DailyReading>) => void;
  currentUser: User;
}

export function DailyOperations({ dailyReadings, onAddReading, onUpdateReading, currentUser }: DailyOperationsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pumpId: '',
    openingMeter: '',
    closingMeter: '',
    litresSold: '',
    unitPrice: '',
    totalSales: '',
    operatorName: currentUser.name,
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    const updates = { ...formData, [field]: value };
    
    // Auto-calculate litres sold
    if (field === 'openingMeter' || field === 'closingMeter') {
      const opening = parseFloat(field === 'openingMeter' ? value : formData.openingMeter) || 0;
      const closing = parseFloat(field === 'closingMeter' ? value : formData.closingMeter) || 0;
      if (closing >= opening && closing > 0) {
        updates.litresSold = (closing - opening).toString();
      }
    }
    
    // Auto-calculate total sales
    if (field === 'litresSold' || field === 'unitPrice' || field === 'openingMeter' || field === 'closingMeter') {
      const litres = parseFloat(updates.litresSold) || 0;
      const price = parseFloat(updates.unitPrice) || 0;
      if (litres > 0 && price > 0) {
        updates.totalSales = (litres * price).toFixed(2);
      }
    }
    
    setFormData(updates);
  };

  const validateForm = (): boolean => {
    if (!formData.pumpId) {
      toast.error('Please select a pump');
      return false;
    }
    
    const opening = parseFloat(formData.openingMeter);
    const closing = parseFloat(formData.closingMeter);
    
    if (isNaN(opening) || isNaN(closing)) {
      toast.error('Please enter valid meter readings');
      return false;
    }
    
    if (closing < opening) {
      toast.error('Closing reading cannot be lower than opening reading');
      return false;
    }
    
    if (parseFloat(formData.unitPrice) <= 0) {
      toast.error('Please enter a valid unit price');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (status: 'draft' | 'submitted') => {
    if (!validateForm()) return;
    
    const reading: Omit<DailyReading, 'id'> = {
      date: formData.date,
      pumpId: formData.pumpId,
      openingMeter: parseFloat(formData.openingMeter),
      closingMeter: parseFloat(formData.closingMeter),
      litresSold: parseFloat(formData.litresSold),
      unitPrice: parseFloat(formData.unitPrice),
      totalSales: parseFloat(formData.totalSales),
      operatorName: formData.operatorName,
      notes: formData.notes,
      status: status,
      submittedAt: status === 'submitted' ? new Date().toISOString() : undefined
    };
    
    onAddReading(reading);
    toast.success(status === 'draft' ? 'Reading saved as draft' : 'Reading submitted successfully');
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      pumpId: '',
      openingMeter: '',
      closingMeter: '',
      litresSold: '',
      unitPrice: '',
      totalSales: '',
      operatorName: currentUser.name,
      notes: ''
    });
    setShowForm(false);
  };

  const handleApprove = (id: string) => {
    onUpdateReading(id, {
      status: 'approved',
      approvedBy: currentUser.name
    });
    toast.success('Reading approved');
  };

  const handleReject = (id: string) => {
    onUpdateReading(id, {
      status: 'rejected',
      approvedBy: currentUser.name
    });
    toast.error('Reading rejected');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { variant: 'secondary', label: 'Draft' },
      submitted: { variant: 'outline', label: 'Submitted' },
      approved: { variant: 'default', label: 'Approved', className: 'bg-green-600' },
      rejected: { variant: 'destructive', label: 'Rejected' }
    };
    
    const config = variants[status] || variants.draft;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#001E2B] mb-2">Daily Operations</h1>
          <p className="text-gray-600">Manual entry for daily fuel station operations</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00796B] hover:bg-[#005f56] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Reading
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-[#001E2B] mb-6">Enter Daily Reading</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Label htmlFor="pumpId">Pump ID</Label>
              <Select value={formData.pumpId} onValueChange={(value) => handleInputChange('pumpId', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select pump" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pump 1">Pump 1</SelectItem>
                  <SelectItem value="Pump 2">Pump 2</SelectItem>
                  <SelectItem value="Pump 3">Pump 3</SelectItem>
                  <SelectItem value="Pump 4">Pump 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorName">Operator Name</Label>
              <Input
                id="operatorName"
                type="text"
                value={formData.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingMeter">Opening Meter Reading</Label>
              <Input
                id="openingMeter"
                type="number"
                step="0.01"
                value={formData.openingMeter}
                onChange={(e) => handleInputChange('openingMeter', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingMeter">Closing Meter Reading</Label>
              <Input
                id="closingMeter"
                type="number"
                step="0.01"
                value={formData.closingMeter}
                onChange={(e) => handleInputChange('closingMeter', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="litresSold">Litres Sold</Label>
              <Input
                id="litresSold"
                type="number"
                step="0.01"
                value={formData.litresSold}
                onChange={(e) => handleInputChange('litresSold', e.target.value)}
                className="h-12 bg-gray-50"
                placeholder="Auto-calculated"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price (GHS/Litre)</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSales">Total Sales (GHS)</Label>
              <Input
                id="totalSales"
                type="number"
                step="0.01"
                value={formData.totalSales}
                onChange={(e) => handleInputChange('totalSales', e.target.value)}
                className="h-12 bg-gray-50"
                placeholder="Auto-calculated"
              />
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="resize-none"
                rows={1}
                placeholder="Any additional notes..."
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button
              onClick={() => handleSubmit('draft')}
              variant="outline"
              className="border-[#00796B] text-[#00796B] hover:bg-[#00796B]/10"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSubmit('submitted')}
              className="bg-[#00796B] hover:bg-[#005f56] text-white"
            >
              Submit Entry
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
        <h2 className="text-[#001E2B] mb-6">All Readings</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-[#001E2B]">Date</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Pump</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Opening</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Closing</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Litres</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Price</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Total</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Operator</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Status</th>
                {currentUser.role !== 'attendant' && (
                  <th className="text-left py-3 px-4 text-[#001E2B]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {dailyReadings.map((reading, index) => (
                <tr key={reading.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 text-gray-700">{new Date(reading.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.pumpId}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.openingMeter.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.closingMeter.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.litresSold.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">GHS {reading.unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-700">GHS {reading.totalSales.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.operatorName}</td>
                  <td className="py-3 px-4">{getStatusBadge(reading.status)}</td>
                  {currentUser.role !== 'attendant' && (
                    <td className="py-3 px-4">
                      {reading.status === 'submitted' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(reading.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(reading.id)}
                            variant="destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {reading.status === 'approved' && reading.approvedBy && (
                        <span className="text-gray-600 text-sm">By {reading.approvedBy}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
