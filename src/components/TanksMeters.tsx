import { useState } from 'react';
import { TankReading } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { Plus, Fuel } from 'lucide-react';

interface TanksMetersProps {
  tankReadings: TankReading[];
  onAddReading: (reading: Omit<TankReading, 'id'>) => void;
}

export function TanksMeters({ tankReadings, onAddReading }: TanksMetersProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tankId: '',
    openingReading: '',
    closingReading: '',
    fuelReceived: '',
    balance: '',
    source: ''
  });

  const handleInputChange = (field: string, value: string) => {
    const updates = { ...formData, [field]: value };
    
    // Auto-calculate balance
    if (field === 'openingReading' || field === 'closingReading' || field === 'fuelReceived') {
      const opening = parseFloat(updates.openingReading) || 0;
      const received = parseFloat(updates.fuelReceived) || 0;
      const closing = parseFloat(updates.closingReading) || 0;
      
      if (closing > 0) {
        updates.balance = closing.toString();
      } else if (opening > 0 && received >= 0) {
        updates.balance = (opening + received).toString();
      }
    }
    
    setFormData(updates);
  };

  const validateForm = (): boolean => {
    if (!formData.tankId) {
      toast.error('Please select a tank');
      return false;
    }
    
    const opening = parseFloat(formData.openingReading);
    const closing = parseFloat(formData.closingReading);
    const received = parseFloat(formData.fuelReceived) || 0;
    
    if (isNaN(opening) || isNaN(closing)) {
      toast.error('Please enter valid readings');
      return false;
    }
    
    if (closing < 0 || opening < 0) {
      toast.error('Readings cannot be negative');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const reading: Omit<TankReading, 'id'> = {
      date: formData.date,
      tankId: formData.tankId,
      openingReading: parseFloat(formData.openingReading),
      closingReading: parseFloat(formData.closingReading),
      fuelReceived: parseFloat(formData.fuelReceived) || 0,
      balance: parseFloat(formData.balance),
      source: formData.source || undefined
    };
    
    onAddReading(reading);
    toast.success('Tank reading recorded successfully');
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      tankId: '',
      openingReading: '',
      closingReading: '',
      fuelReceived: '',
      balance: '',
      source: ''
    });
    setShowForm(false);
  };

  // Calculate tank summary
  const tankSummary = tankReadings.reduce((acc, reading) => {
    if (!acc[reading.tankId]) {
      acc[reading.tankId] = {
        currentLevel: 0,
        capacity: 10000, // Mock capacity
        lastUpdated: reading.date
      };
    }
    
    if (reading.date >= acc[reading.tankId].lastUpdated) {
      acc[reading.tankId].currentLevel = reading.balance;
      acc[reading.tankId].lastUpdated = reading.date;
    }
    
    return acc;
  }, {} as Record<string, { currentLevel: number; capacity: number; lastUpdated: string }>);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#001E2B] mb-2">Tanks & Meters</h1>
          <p className="text-gray-600">Record fuel storage tank readings and refills</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00796B] hover:bg-[#005f56] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Tank Reading
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-[#001E2B] mb-6">Record Tank Reading</h2>
          
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
              <Label htmlFor="tankId">Tank ID</Label>
              <Select value={formData.tankId} onValueChange={(value) => handleInputChange('tankId', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select tank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tank A">Tank A</SelectItem>
                  <SelectItem value="Tank B">Tank B</SelectItem>
                  <SelectItem value="Tank C">Tank C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingReading">Opening Reading (Litres)</Label>
              <Input
                id="openingReading"
                type="number"
                step="0.01"
                value={formData.openingReading}
                onChange={(e) => handleInputChange('openingReading', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingReading">Closing Reading (Litres)</Label>
              <Input
                id="closingReading"
                type="number"
                step="0.01"
                value={formData.closingReading}
                onChange={(e) => handleInputChange('closingReading', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelReceived">Fuel Received (Litres)</Label>
              <Input
                id="fuelReceived"
                type="number"
                step="0.01"
                value={formData.fuelReceived}
                onChange={(e) => handleInputChange('fuelReceived', e.target.value)}
                className="h-12"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Balance (Litres)</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => handleInputChange('balance', e.target.value)}
                className="h-12 bg-gray-50"
                placeholder="Auto-calculated"
              />
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="source">Source (Depot / Truck)</Label>
              <Input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="h-12"
                placeholder="e.g., Depot Refill - Truck #5432"
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button
              onClick={handleSubmit}
              className="bg-[#00796B] hover:bg-[#005f56] text-white"
            >
              Save Reading
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(tankSummary).map(([tankId, data]) => {
          const percentage = (data.currentLevel / data.capacity) * 100;
          return (
            <Card key={tankId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[#001E2B] mb-1">{tankId}</h3>
                  <p className="text-gray-600 text-sm">Last updated: {new Date(data.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#00796B]/10 flex items-center justify-center">
                  <Fuel className="w-6 h-6 text-[#00796B]" />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Current Level</span>
                  <span className="text-[#001E2B]">{data.currentLevel.toLocaleString()} L</span>
                </div>
                <Progress value={percentage} className="h-3" />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600 text-sm">{percentage.toFixed(1)}% full</span>
                  <span className="text-gray-600 text-sm">Capacity: {data.capacity.toLocaleString()} L</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-[#001E2B] mb-6">All Tank Readings</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-[#001E2B]">Date</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Tank ID</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Opening</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Closing</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Fuel Received</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Balance</th>
                <th className="text-left py-3 px-4 text-[#001E2B]">Source</th>
              </tr>
            </thead>
            <tbody>
              {tankReadings.map((reading, index) => (
                <tr key={reading.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 text-gray-700">{new Date(reading.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.tankId}</td>
                  <td className="py-3 px-4 text-gray-700">{reading.openingReading.toLocaleString()} L</td>
                  <td className="py-3 px-4 text-gray-700">{reading.closingReading.toLocaleString()} L</td>
                  <td className="py-3 px-4 text-gray-700">
                    {reading.fuelReceived > 0 ? (
                      <span className="text-green-600">+{reading.fuelReceived.toLocaleString()} L</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{reading.balance.toLocaleString()} L</td>
                  <td className="py-3 px-4 text-gray-700">{reading.source || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
