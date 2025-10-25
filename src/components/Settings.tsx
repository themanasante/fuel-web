import { useState } from 'react';
import { User } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

interface SettingsProps {
  currentUser: User;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface StationAsset {
  id: string;
  type: 'pump' | 'tank';
  name: string;
  capacity?: number;
  status: 'active' | 'inactive';
}

export function Settings({ currentUser }: SettingsProps) {
  const [users, setUsers] = useState<MockUser[]>([
    { id: '1', name: 'John Doe', email: 'john@station.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@station.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@station.com', role: 'attendant', status: 'active' }
  ]);

  const [assets, setAssets] = useState<StationAsset[]>([
    { id: '1', type: 'pump', name: 'Pump 1', status: 'active' },
    { id: '2', type: 'pump', name: 'Pump 2', status: 'active' },
    { id: '3', type: 'pump', name: 'Pump 3', status: 'active' },
    { id: '4', type: 'pump', name: 'Pump 4', status: 'active' },
    { id: '5', type: 'tank', name: 'Tank A', capacity: 10000, status: 'active' },
    { id: '6', type: 'tank', name: 'Tank B', capacity: 10000, status: 'active' },
    { id: '7', type: 'tank', name: 'Tank C', capacity: 10000, status: 'active' }
  ]);

  const [showUserForm, setShowUserForm] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'attendant',
    password: ''
  });

  const [assetForm, setAssetForm] = useState({
    type: 'pump' as 'pump' | 'tank',
    name: '',
    capacity: ''
  });

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const newUser: MockUser = {
      id: Date.now().toString(),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: 'active'
    };

    setUsers([...users, newUser]);
    toast.success('User added successfully');
    setUserForm({ name: '', email: '', role: 'attendant', password: '' });
    setShowUserForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User deleted successfully');
  };

  const handleAddAsset = () => {
    if (!assetForm.name) {
      toast.error('Please enter a name');
      return;
    }

    const newAsset: StationAsset = {
      id: Date.now().toString(),
      type: assetForm.type,
      name: assetForm.name,
      capacity: assetForm.capacity ? parseInt(assetForm.capacity) : undefined,
      status: 'active'
    };

    setAssets([...assets, newAsset]);
    toast.success(`${assetForm.type === 'pump' ? 'Pump' : 'Tank'} added successfully`);
    setAssetForm({ type: 'pump', name: '', capacity: '' });
    setShowAssetForm(false);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    toast.success('Asset deleted successfully');
  };

  if (currentUser.role === 'attendant') {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-[#001E2B] mb-2">Settings</h1>
          <p className="text-gray-600">System configuration and preferences</p>
        </div>

        <Card className="p-6">
          <p className="text-gray-600">You do not have permission to access settings.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#001E2B] mb-2">Settings</h1>
        <p className="text-gray-600">System configuration and preferences</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="station">Station Setup</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#001E2B]">Users</h2>
            {currentUser.role === 'admin' && (
              <Button
                onClick={() => setShowUserForm(!showUserForm)}
                className="bg-[#00796B] hover:bg-[#005f56] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            )}
          </div>

          {showUserForm && (
            <Card className="p-6">
              <h3 className="text-[#001E2B] mb-4">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendant">Attendant</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <Button onClick={handleAddUser} className="bg-[#00796B] hover:bg-[#005f56] text-white">
                  Add User
                </Button>
                <Button onClick={() => setShowUserForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[#001E2B]">Name</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Email</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Role</th>
                    <th className="text-left py-3 px-4 text-[#001E2B]">Status</th>
                    {currentUser.role === 'admin' && (
                      <th className="text-left py-3 px-4 text-[#001E2B]">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 text-gray-700">{user.name}</td>
                      <td className="py-3 px-4 text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-600' : ''}>
                          {user.status}
                        </Badge>
                      </td>
                      {currentUser.role === 'admin' && (
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="station" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#001E2B]">Pumps & Tanks</h2>
            <Button
              onClick={() => setShowAssetForm(!showAssetForm)}
              className="bg-[#00796B] hover:bg-[#005f56] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Pump/Tank
            </Button>
          </div>

          {showAssetForm && (
            <Card className="p-6">
              <h3 className="text-[#001E2B] mb-4">Add New Asset</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={assetForm.type} onValueChange={(value: 'pump' | 'tank') => setAssetForm({ ...assetForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pump">Pump</SelectItem>
                      <SelectItem value="tank">Tank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                    placeholder="e.g., Pump 5 or Tank D"
                  />
                </div>
                {assetForm.type === 'tank' && (
                  <div className="space-y-2">
                    <Label>Capacity (Litres)</Label>
                    <Input
                      type="number"
                      value={assetForm.capacity}
                      onChange={(e) => setAssetForm({ ...assetForm, capacity: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                )}
              </div>
              <div className="flex space-x-4 mt-4">
                <Button onClick={handleAddAsset} className="bg-[#00796B] hover:bg-[#005f56] text-white">
                  Add Asset
                </Button>
                <Button onClick={() => setShowAssetForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-[#001E2B] mb-4">Pumps</h3>
              <div className="space-y-3">
                {assets.filter(a => a.type === 'pump').map((pump) => (
                  <div key={pump.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[#001E2B]">{pump.name}</p>
                      <Badge variant={pump.status === 'active' ? 'default' : 'secondary'} className={pump.status === 'active' ? 'bg-green-600 mt-1' : 'mt-1'}>
                        {pump.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAsset(pump.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-[#001E2B] mb-4">Tanks</h3>
              <div className="space-y-3">
                {assets.filter(a => a.type === 'tank').map((tank) => (
                  <div key={tank.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-[#001E2B]">{tank.name}</p>
                      <p className="text-gray-600 text-sm">Capacity: {tank.capacity?.toLocaleString()} L</p>
                      <Badge variant={tank.status === 'active' ? 'default' : 'secondary'} className={tank.status === 'active' ? 'bg-green-600 mt-1' : 'mt-1'}>
                        {tank.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAsset(tank.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Date & Time Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select defaultValue="24">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour</SelectItem>
                    <SelectItem value="24">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Currency & Units</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input defaultValue="GHS" placeholder="Currency code" />
              </div>
              <div className="space-y-2">
                <Label>Volume Unit</Label>
                <Select defaultValue="litres">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="litres">Litres</SelectItem>
                    <SelectItem value="gallons">Gallons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[#001E2B] mb-4">Permissions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[#001E2B]">Attendants can submit readings</p>
                  <p className="text-gray-600 text-sm">Allow attendants to submit daily readings</p>
                </div>
                <Badge className="bg-green-600">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[#001E2B]">Manager approval required</p>
                  <p className="text-gray-600 text-sm">All readings must be approved by manager</p>
                </div>
                <Badge className="bg-green-600">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[#001E2B]">Auto-save drafts</p>
                  <p className="text-gray-600 text-sm">Automatically save form data as draft</p>
                </div>
                <Badge className="bg-green-600">Enabled</Badge>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-[#00796B] hover:bg-[#005f56] text-white">
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
