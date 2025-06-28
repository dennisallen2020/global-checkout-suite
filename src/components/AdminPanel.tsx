
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Palette, 
  Shield, 
  BarChart3, 
  Mail, 
  Globe,
  Upload,
  Save,
  Eye,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

interface AdminConfig {
  productName: string;
  productDescription: string;
  originalPrice: number;
  salePrice: number;
  currency: string;
  stripePublishableKey: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  logoUrl: string;
  bannerUrl: string;
  securityFeatures: {
    antiRightClick: boolean;
    antiCopy: boolean;
    antiDevTools: boolean;
    antiDebug: boolean;
  };
  emailNotifications: boolean;
  adminPassword: string;
}

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState<AdminConfig>({
    productName: 'Premium Product',
    productDescription: 'Advanced digital solution for professionals',
    originalPrice: 297,
    salePrice: 97,
    currency: 'USD',
    stripePublishableKey: '',
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    backgroundColor: '#f8fafc',
    logoUrl: '',
    bannerUrl: '',
    securityFeatures: {
      antiRightClick: true,
      antiCopy: true,
      antiDevTools: true,
      antiDebug: true
    },
    emailNotifications: true,
    adminPassword: 'admin123'
  });

  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    todaySales: 0,
    uniqueCustomers: 0,
    conversionRate: 0
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.adminPassword) {
      setIsAuthenticated(true);
      loadStats();
    } else {
      alert('Invalid password!');
    }
  };

  const loadStats = () => {
    // Simulate loading statistics
    setStats({
      totalSales: 1247,
      totalRevenue: 121063,
      todaySales: 23,
      uniqueCustomers: 1098,
      conversionRate: 12.4
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      securityFeatures: {
        ...prev.securityFeatures,
        [key]: value
      }
    }));
  };

  const saveConfiguration = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('checkoutConfig', JSON.stringify(config));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const exportData = () => {
    const data = {
      config,
      stats,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checkout-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout Admin Panel</h1>
          <div className="flex space-x-2">
            <Button onClick={exportData} variant="outline">
              Export Data
            </Button>
            <Button onClick={saveConfiguration} disabled={saveStatus === 'saving'}>
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {saveStatus === 'saved' && (
          <Alert className="mb-4 border-green-500 bg-green-50">
            <AlertDescription>Configuration saved successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="product">
              <Settings className="w-4 h-4 mr-2" />
              Product
            </TabsTrigger>
            <TabsTrigger value="design">
              <Palette className="w-4 h-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Mail className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sales</p>
                      <p className="text-3xl font-bold">{stats.totalSales}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                      <p className="text-3xl font-bold">{stats.todaySales}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                      <p className="text-3xl font-bold">{stats.uniqueCustomers}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">New purchase from customer #{1000 + item}</p>
                        <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
                      </div>
                      <Badge variant="secondary">$97.00</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={config.productName}
                    onChange={(e) => handleConfigChange('productName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="productDescription">Product Description</Label>
                  <Textarea
                    id="productDescription"
                    value={config.productDescription}
                    onChange={(e) => handleConfigChange('productDescription', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={config.originalPrice}
                      onChange={(e) => handleConfigChange('originalPrice', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      value={config.salePrice}
                      onChange={(e) => handleConfigChange('salePrice', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={config.currency}
                    onChange={(e) => handleConfigChange('currency', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    value={config.stripePublishableKey}
                    onChange={(e) => handleConfigChange('stripePublishableKey', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={config.logoUrl}
                    onChange={(e) => handleConfigChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="bannerUrl">Banner URL</Label>
                  <Input
                    id="bannerUrl"
                    value={config.bannerUrl}
                    onChange={(e) => handleConfigChange('bannerUrl', e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiRightClick">Anti Right Click</Label>
                    <p className="text-sm text-gray-600">Prevents right-click context menu</p>
                  </div>
                  <Switch
                    id="antiRightClick"
                    checked={config.securityFeatures.antiRightClick}
                    onCheckedChange={(checked) => handleSecurityChange('antiRightClick', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiCopy">Anti Copy</Label>
                    <p className="text-sm text-gray-600">Prevents text selection and copying</p>
                  </div>
                  <Switch
                    id="antiCopy"
                    checked={config.securityFeatures.antiCopy}
                    onCheckedChange={(checked) => handleSecurityChange('antiCopy', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiDevTools">Anti Developer Tools</Label>
                    <p className="text-sm text-gray-600">Blocks access to browser dev tools</p>
                  </div>
                  <Switch
                    id="antiDevTools"
                    checked={config.securityFeatures.antiDevTools}
                    onCheckedChange={(checked) => handleSecurityChange('antiDevTools', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiDebug">Anti Debug</Label>
                    <p className="text-sm text-gray-600">Prevents debugging attempts</p>
                  </div>
                  <Switch
                    id="antiDebug"
                    checked={config.securityFeatures.antiDebug}
                    onCheckedChange={(checked) => handleSecurityChange('antiDebug', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send email alerts for new purchases</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={config.emailNotifications}
                    onCheckedChange={(checked) => handleConfigChange('emailNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Preview how your checkout page will look with current settings.
                </p>
                <Button className="w-full" onClick={() => window.open('/', '_blank')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Open Live Preview
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
