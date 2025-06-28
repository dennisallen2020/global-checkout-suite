
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Palette, 
  Shield, 
  BarChart3, 
  Mail, 
  Eye,
  Save,
  Users,
  Activity
} from 'lucide-react';

import { Dashboard } from './admin/Dashboard';
import { EmailConfig } from './admin/EmailConfig';
import { OnlineUsers } from './admin/OnlineUsers';

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

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password!');
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              <Shield className="w-8 h-8 mx-auto mb-4 text-blue-600" />
              Painel Administrativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Senha de Acesso</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie seu checkout e vendas</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={exportData} variant="outline">
                Exportar Dados
              </Button>
              <Button onClick={saveConfiguration} disabled={saveStatus === 'saving'}>
                <Save className="w-4 h-4 mr-2" />
                {saveStatus === 'saving' ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saveStatus === 'saved' && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <AlertDescription>Configurações salvas com sucesso!</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Online</span>
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Produto</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Design</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="online">
            <OnlineUsers />
          </TabsContent>

          <TabsContent value="product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input
                    id="productName"
                    value={config.productName}
                    onChange={(e) => handleConfigChange('productName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="productDescription">Descrição do Produto</Label>
                  <Textarea
                    id="productDescription"
                    value={config.productDescription}
                    onChange={(e) => handleConfigChange('productDescription', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Preço Original</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={config.originalPrice}
                      onChange={(e) => handleConfigChange('originalPrice', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="salePrice">Preço de Venda</Label>
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
                  <Label htmlFor="currency">Moeda</Label>
                  <Input
                    id="currency"
                    value={config.currency}
                    onChange={(e) => handleConfigChange('currency', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="stripeKey">Chave Pública do Stripe</Label>
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
                <CardTitle>Personalização Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                    id="logoUrl"
                    value={config.logoUrl}
                    onChange={(e) => handleConfigChange('logoUrl', e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="bannerUrl">URL do Banner</Label>
                  <Input
                    id="bannerUrl"
                    value={config.bannerUrl}
                    onChange={(e) => handleConfigChange('bannerUrl', e.target.value)}
                    placeholder="https://exemplo.com/banner.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <EmailConfig />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiRightClick">Bloquear Clique Direito</Label>
                    <p className="text-sm text-gray-600">Impede o menu de contexto</p>
                  </div>
                  <Switch
                    id="antiRightClick"
                    checked={config.securityFeatures.antiRightClick}
                    onCheckedChange={(checked) => handleSecurityChange('antiRightClick', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiCopy">Bloquear Cópia</Label>
                    <p className="text-sm text-gray-600">Impede seleção e cópia de texto</p>
                  </div>
                  <Switch
                    id="antiCopy"
                    checked={config.securityFeatures.antiCopy}
                    onCheckedChange={(checked) => handleSecurityChange('antiCopy', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="antiDevTools">Bloquear DevTools</Label>
                    <p className="text-sm text-gray-600">Bloqueia ferramentas de desenvolvedor</p>
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
                    <p className="text-sm text-gray-600">Previne tentativas de debugging</p>
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

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualização do Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Visualize como seu checkout aparece para os clientes.
                </p>
                <Button className="w-full" onClick={() => window.open('/', '_blank')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Abrir Preview
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
