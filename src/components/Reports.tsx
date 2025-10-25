import { useState } from 'react';
import { DailyReading, PriceRecord, TankReading, Expense } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ReportsProps {
  dailyReadings: DailyReading[];
  priceRecords: PriceRecord[];
  tankReadings: TankReading[];
  expenses: Expense[];
}

export function Reports({ dailyReadings, priceRecords, tankReadings, expenses }: ReportsProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedPump, setSelectedPump] = useState('all');
  const [selectedTank, setSelectedTank] = useState('all');

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
    // In a real app, this would generate and download the file
  };

  const filterByDate = (date: string) => {
    if (!dateFrom && !dateTo) return true;
    if (dateFrom && date < dateFrom) return false;
    if (dateTo && date > dateTo) return false;
    return true;
  };

  // Daily Sales Summary
  const filteredReadings = dailyReadings.filter(r => {
    if (!filterByDate(r.date)) return false;
    if (selectedPump !== 'all' && r.pumpId !== selectedPump) return false;
    return true;
  });

  const totalLitresSold = filteredReadings.reduce((sum, r) => sum + r.litresSold, 0);
  const totalSales = filteredReadings.reduce((sum, r) => sum + r.totalSales, 0);
  const averagePrice = totalLitresSold > 0 ? totalSales / totalLitresSold : 0;

  const salesByPump = filteredReadings.reduce((acc, reading) => {
    if (!acc[reading.pumpId]) {
      acc[reading.pumpId] = { litres: 0, sales: 0, count: 0 };
    }
    acc[reading.pumpId].litres += reading.litresSold;
    acc[reading.pumpId].sales += reading.totalSales;
    acc[reading.pumpId].count += 1;
    return acc;
  }, {} as Record<string, { litres: number; sales: number; count: number }>);

  // Tank Readings Summary
  const filteredTankReadings = tankReadings.filter(r => {
    if (!filterByDate(r.date)) return false;
    if (selectedTank !== 'all' && r.tankId !== selectedTank) return false;
    return true;
  });

  const totalFuelReceived = filteredTankReadings.reduce((sum, r) => sum + r.fuelReceived, 0);

  const tankSummary = filteredTankReadings.reduce((acc, reading) => {
    if (!acc[reading.tankId]) {
      acc[reading.tankId] = { received: 0, balance: 0, count: 0 };
    }
    acc[reading.tankId].received += reading.fuelReceived;
    acc[reading.tankId].balance = reading.balance;
    acc[reading.tankId].count += 1;
    return acc;
  }, {} as Record<string, { received: number; balance: number; count: number }>);

  // Expenses Summary
  const filteredExpenses = expenses.filter(e => filterByDate(e.date));
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Price History
  const filteredPrices = priceRecords.filter(p => filterByDate(p.date));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#001E2B] mb-2">Reports</h1>
          <p className="text-gray-600">View and export operational reports</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleExport('pdf')}
            variant="outline"
            className="border-[#00796B] text-[#00796B] hover:bg-[#00796B]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={() => handleExport('excel')}
            variant="outline"
            className="border-[#00796B] text-[#00796B] hover:bg-[#00796B]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            className="border-[#00796B] text-[#00796B] hover:bg-[#00796B]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-[#001E2B] mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Pump ID</Label>
            <Select value={selectedPump} onValueChange={setSelectedPump}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pumps</SelectItem>
                <SelectItem value="Pump 1">Pump 1</SelectItem>
                <SelectItem value="Pump 2">Pump 2</SelectItem>
                <SelectItem value="Pump 3">Pump 3</SelectItem>
                <SelectItem value="Pump 4">Pump 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tank ID</Label>
            <Select value={selectedTank} onValueChange={setSelectedTank}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tanks</SelectItem>
                <SelectItem value="Tank A">Tank A</SelectItem>
                <SelectItem value="Tank B">Tank B</SelectItem>
                <SelectItem value="Tank C">Tank C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Daily Sales</TabsTrigger>
          <TabsTrigger value="tanks">Tank Readings</TabsTrigger>
          <TabsTrigger value="prices">Price History</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="combined">Combined</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Total Litres Sold</p>
              <p className="text-[#001E2B] text-3xl">{totalLitresSold.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-1">Across {filteredReadings.length} readings</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Total Sales</p>
              <p className="text-[#001E2B] text-3xl">GHS {totalSales.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-1">Revenue generated</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Average Price</p>
              <p className="text-[#001E2B] text-3xl">GHS {averagePrice.toFixed(2)}</p>
              <p className="text-gray-600 text-sm mt-1">Per litre</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Sales by Pump</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[#001E2B]">Pump ID</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Litres Sold</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Total Sales</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Avg Price</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Readings</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(salesByPump).map(([pumpId, data], index) => (
                    <tr key={pumpId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 text-gray-700">{pumpId}</td>
                      <td className="py-3 px-4 text-gray-700">{data.litres.toLocaleString()} L</td>
                      <td className="py-3 px-4 text-gray-700">GHS {data.sales.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700">GHS {(data.sales / data.litres).toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-700">{data.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tanks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Total Fuel Received</p>
              <p className="text-[#001E2B] text-3xl">{totalFuelReceived.toLocaleString()} L</p>
              <p className="text-gray-600 text-sm mt-1">During selected period</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Tank Readings</p>
              <p className="text-[#001E2B] text-3xl">{filteredTankReadings.length}</p>
              <p className="text-gray-600 text-sm mt-1">Total records</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Tank Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[#001E2B]">Tank ID</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Fuel Received</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Current Balance</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Readings</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tankSummary).map(([tankId, data], index) => (
                    <tr key={tankId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 text-gray-700">{tankId}</td>
                      <td className="py-3 px-4 text-gray-700">{data.received.toLocaleString()} L</td>
                      <td className="py-3 px-4 text-gray-700">{data.balance.toLocaleString()} L</td>
                      <td className="py-3 px-4 text-gray-700">{data.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prices" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Price Change History</h3>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((record, index) => {
                    const change = record.newPrice - record.oldPrice;
                    return (
                      <tr key={record.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-gray-700">{record.product}</td>
                        <td className="py-3 px-4 text-gray-700">GHS {record.oldPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-700">GHS {record.newPrice.toFixed(2)}</td>
                        <td className={`py-3 px-4 ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {change > 0 ? '+' : ''}GHS {change.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{record.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Total Expenses</p>
              <p className="text-[#001E2B] text-3xl">GHS {totalExpenses.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mt-1">During selected period</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Transactions</p>
              <p className="text-[#001E2B] text-3xl">{filteredExpenses.length}</p>
              <p className="text-gray-600 text-sm mt-1">Expense records</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Expenses by Category</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[#001E2B]">Category</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Amount</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(expensesByCategory).map(([category, amount], index) => (
                    <tr key={category} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 text-gray-700">{category}</td>
                      <td className="py-3 px-4 text-gray-700">GHS {amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {((amount / totalExpenses) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="combined" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Total Sales</p>
              <p className="text-[#001E2B] text-2xl">GHS {totalSales.toLocaleString()}</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Total Expenses</p>
              <p className="text-[#001E2B] text-2xl">GHS {totalExpenses.toLocaleString()}</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Net Profit</p>
              <p className="text-[#001E2B] text-2xl">GHS {(totalSales - totalExpenses).toLocaleString()}</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-gray-600 mb-2">Litres Sold</p>
              <p className="text-[#001E2B] text-2xl">{totalLitresSold.toLocaleString()} L</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-600 mb-1">Revenue</p>
                  <p className="text-[#001E2B] text-xl">GHS {totalSales.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Cost</p>
                  <p className="text-[#001E2B] text-xl">GHS {totalExpenses.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Profit Margin</p>
                  <p className="text-[#001E2B] text-xl">
                    {totalSales > 0 ? (((totalSales - totalExpenses) / totalSales) * 100).toFixed(1) : '0.0'}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Avg Daily Sales</p>
                  <p className="text-[#001E2B] text-xl">
                    GHS {filteredReadings.length > 0 ? (totalSales / filteredReadings.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
