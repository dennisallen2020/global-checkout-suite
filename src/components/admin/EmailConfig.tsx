
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
  Mail, 
  Settings, 
  Image, 
  FileText, 
  Send,
  User,
  Store,
  Eye,
  TestTube
} from 'lucide-react';

interface EmailSettings {
  // Configurações SMTP
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  
  // Emails
  fromEmail: string;
  fromName: string;
  adminEmail: string;
  
  // Templates do Cliente
  customerSubject: string;
  customerTemplate: string;
  customerIncludeProductImage: boolean;
  customerIncludeInvoice: boolean;
  
  // Templates do Vendedor
  vendorSubject: string;
  vendorTemplate: string;
  vendorIncludeCustomerDetails: boolean;
  
  // Configurações Gerais
  enableEmails: boolean;
  enableAutoResponse: boolean;
  attachReceipt: boolean;
}

const defaultTemplate = {
  customer: `Olá {{customerName}},

Obrigado pela sua compra! Segue os detalhes:

PRODUTO: {{productName}}
VALOR: {{amount}} {{currency}}
DATA: {{purchaseDate}}
ID DA TRANSAÇÃO: {{transactionId}}

{{#if productImage}}
[IMAGEM DO PRODUTO ANEXADA]
{{/if}}

Para suporte, responda este email.

Atenciosamente,
{{companyName}}`,

  vendor: `Nova venda realizada!

CLIENTE: {{customerName}} ({{customerEmail}})
PRODUTO: {{productName}}
VALOR: {{amount}} {{currency}}
DATA: {{purchaseDate}}
ID: {{transactionId}}
PAÍS: {{customerCountry}}

{{#if customerDetails}}
DETALHES DO CLIENTE:
- Email: {{customerEmail}}
- País: {{customerCountry}}
- IP: {{customerIP}}
{{/if}}

Dashboard: {{dashboardUrl}}`
};

export const EmailConfig: React.FC = () => {
  const [settings, setSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    fromEmail: '',
    fromName: '',
    adminEmail: '',
    customerSubject: 'Confirmação de Compra - {{productName}}',
    customerTemplate: defaultTemplate.customer,
    customerIncludeProductImage: true,
    customerIncludeInvoice: true,
    vendorSubject: 'Nova Venda - {{productName}}',
    vendorTemplate: defaultTemplate.vendor,
    vendorIncludeCustomerDetails: true,
    enableEmails: true,
    enableAutoResponse: true,
    attachReceipt: true
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Carregar configurações salvas
    const saved = localStorage.getItem('emailSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSettingChange = (key: keyof EmailSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('emailSettings', JSON.stringify(settings));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const testEmailConfiguration = async () => {
    setTestStatus('testing');
    try {
      // Simular teste de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para testar o email
      // const response = await fetch('/api/test-email', { method: 'POST', body: JSON.stringify(settings) });
      
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch (error) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  const availableVariables = [
    '{{customerName}}', '{{customerEmail}}', '{{productName}}', 
    '{{amount}}', '{{currency}}', '{{purchaseDate}}', 
    '{{transactionId}}', '{{customerCountry}}', '{{companyName}}'
  ];

  return (
    <div className="space-y-6">
      {saveStatus === 'saved' && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription>Configurações de email salvas com sucesso!</AlertDescription>
        </Alert>
      )}

      {testStatus === 'success' && (
        <Alert className="border-blue-500 bg-blue-50">
          <AlertDescription>Teste de email enviado com sucesso!</AlertDescription>
        </Alert>
      )}

      {testStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>Erro ao enviar email de teste. Verifique as configurações SMTP.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="smtp">
            <Settings className="w-4 h-4 mr-2" />
            SMTP
          </TabsTrigger>
          <TabsTrigger value="customer">
            <User className="w-4 h-4 mr-2" />
            Cliente
          </TabsTrigger>
          <TabsTrigger value="vendor">
            <Store className="w-4 h-4 mr-2" />
            Vendedor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações SMTP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">Porta</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtpUser">Usuário SMTP</Label>
                <Input
                  id="smtpUser"
                  type="email"
                  value={settings.smtpUser}
                  onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="smtpPassword">Senha SMTP</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                  placeholder="Senha ou App Password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="smtpSecure"
                  checked={settings.smtpSecure}
                  onCheckedChange={(checked) => handleSettingChange('smtpSecure', checked)}
                />
                <Label htmlFor="smtpSecure">Usar SSL/TLS</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">Email de Envio</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                    placeholder="vendas@seusite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">Nome do Remetente</Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) => handleSettingChange('fromName', e.target.value)}
                    placeholder="Sua Empresa"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adminEmail">Email do Administrador</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                  placeholder="admin@seusite.com"
                />
              </div>

              <Button 
                onClick={testEmailConfiguration}
                disabled={testStatus === 'testing'}
                className="w-full"
              >
                <TestTube className="w-4 h-4 mr-2" />
                {testStatus === 'testing' ? 'Testando...' : 'Testar Configuração'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email para o Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerSubject">Assunto do Email</Label>
                <Input
                  id="customerSubject"
                  value={settings.customerSubject}
                  onChange={(e) => handleSettingChange('customerSubject', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="customerTemplate">Template do Email</Label>
                <Textarea
                  id="customerTemplate"
                  value={settings.customerTemplate}
                  onChange={(e) => handleSettingChange('customerTemplate', e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="customerIncludeProductImage"
                    checked={settings.customerIncludeProductImage}
                    onCheckedChange={(checked) => handleSettingChange('customerIncludeProductImage', checked)}
                  />
                  <Label htmlFor="customerIncludeProductImage">Incluir imagem do produto</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="customerIncludeInvoice"
                    checked={settings.customerIncludeInvoice}
                    onCheckedChange={(checked) => handleSettingChange('customerIncludeInvoice', checked)}
                  />
                  <Label htmlFor="customerIncludeInvoice">Anexar recibo/fatura</Label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Variáveis Disponíveis:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {availableVariables.map(variable => (
                    <code key={variable} className="bg-white px-2 py-1 rounded">
                      {variable}
                    </code>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email para o Vendedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vendorSubject">Assunto do Email</Label>
                <Input
                  id="vendorSubject"
                  value={settings.vendorSubject}
                  onChange={(e) => handleSettingChange('vendorSubject', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="vendorTemplate">Template do Email</Label>
                <Textarea
                  id="vendorTemplate"
                  value={settings.vendorTemplate}
                  onChange={(e) => handleSettingChange('vendorTemplate', e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="vendorIncludeCustomerDetails"
                  checked={settings.vendorIncludeCustomerDetails}
                  onCheckedChange={(checked) => handleSettingChange('vendorIncludeCustomerDetails', checked)}
                />
                <Label htmlFor="vendorIncludeCustomerDetails">Incluir detalhes completos do cliente</Label>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Variáveis Disponíveis:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {availableVariables.map(variable => (
                    <code key={variable} className="bg-white px-2 py-1 rounded">
                      {variable}
                    </code>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview - Email do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="border-b pb-2 mb-4">
                    <p className="font-semibold">Para: cliente@exemplo.com</p>
                    <p className="font-semibold">Assunto: {settings.customerSubject.replace('{{productName}}', 'Produto Digital')}</p>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {settings.customerTemplate
                      .replace(/\{\{customerName\}\}/g, 'João Silva')
                      .replace(/\{\{productName\}\}/g, 'Produto Digital')
                      .replace(/\{\{amount\}\}/g, 'R$ 97,00')
                      .replace(/\{\{currency\}\}/g, 'BRL')
                      .replace(/\{\{purchaseDate\}\}/g, new Date().toLocaleDateString('pt-BR'))
                      .replace(/\{\{transactionId\}\}/g, 'TXN123456')
                      .replace(/\{\{companyName\}\}/g, 'Sua Empresa')
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview - Email do Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="border-b pb-2 mb-4">
                    <p className="font-semibold">Para: {settings.adminEmail}</p>
                    <p className="font-semibold">Assunto: {settings.vendorSubject.replace('{{productName}}', 'Produto Digital')}</p>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {settings.vendorTemplate
                      .replace(/\{\{customerName\}\}/g, 'João Silva')
                      .replace(/\{\{customerEmail\}\}/g, 'cliente@exemplo.com')
                      .replace(/\{\{productName\}\}/g, 'Produto Digital')
                      .replace(/\{\{amount\}\}/g, 'R$ 97,00')
                      .replace(/\{\{currency\}\}/g, 'BRL')
                      .replace(/\{\{purchaseDate\}\}/g, new Date().toLocaleDateString('pt-BR'))
                      .replace(/\{\{transactionId\}\}/g, 'TXN123456')
                      .replace(/\{\{customerCountry\}\}/g, 'Brasil')
                      .replace(/\{\{dashboardUrl\}\}/g, window.location.origin + '/admin')
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button onClick={saveSettings} disabled={saveStatus === 'saving'}>
          <Mail className="w-4 h-4 mr-2" />
          {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};
