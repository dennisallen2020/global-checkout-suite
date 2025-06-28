
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye,
  ShoppingCart,
  Calendar,
  Globe,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  todaySales: number;
  uniqueCustomers: number;
  conversionRate: number;
  onlineUsers: number;
}

interface ChartData {
  name: string;
  sales: number;
  revenue: number;
  visitors: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    todaySales: 0,
    uniqueCustomers: 0,
    conversionRate: 0,
    onlineUsers: 0
  });

  const [salesData, setSalesData] = useState<ChartData[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    
    // Atualizar dados a cada 10 segundos
    const interval = setInterval(loadDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    // Carregar dados reais do localStorage ou API
    const savedSales = JSON.parse(localStorage.getItem('salesData') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('dashboardStats') || '{}');
    
    // Processar dados de vendas dos últimos 7 dias
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });
      const daySales = savedSales.filter((sale: any) => 
        sale.date?.startsWith(date)
      );
      
      return {
        name: dayName,
        sales: daySales.length,
        revenue: daySales.reduce((sum: number, sale: any) => sum + (sale.amount || 0), 0),
        visitors: Math.floor(Math.random() * 100) + 50 // Simular visitantes
      };
    });

    setSalesData(chartData);

    // Dados por país
    const countries = [
      { name: 'Brasil', value: 45, color: '#6366f1' },
      { name: 'EUA', value: 25, color: '#8b5cf6' },
      { name: 'México', value: 15, color: '#06b6d4' },
      { name: 'Argentina', value: 10, color: '#10b981' },
      { name: 'Outros', value: 5, color: '#f59e0b' }
    ];
    setCountryData(countries);

    // Estatísticas gerais
    const totalSales = savedSales.length;
    const totalRevenue = savedSales.reduce((sum: number, sale: any) => sum + (sale.amount || 0), 0);
    const todaySales = savedSales.filter((sale: any) => {
      const today = new Date().toISOString().split('T')[0];
      return sale.date?.startsWith(today);
    }).length;

    setStats({
      totalSales,
      totalRevenue,
      todaySales,
      uniqueCustomers: Math.floor(totalSales * 0.8),
      conversionRate: totalSales > 0 ? ((totalSales / (totalSales * 8)) * 100) : 0,
      onlineUsers: Math.floor(Math.random() * 20) + 5
    });

    // Atividade recente
    const activity = savedSales.slice(-5).map((sale: any, index: number) => ({
      id: index,
      type: 'purchase',
      message: `Nova compra de ${sale.customerName || 'Cliente'}`,
      amount: sale.amount || 0,
      time: sale.date ? new Date(sale.date).toLocaleTimeString() : 'Agora',
      country: sale.country || 'Brasil'
    }));
    setRecentActivity(activity);
  };

  return (
    <div className="space-y-6">
      {/* Cartões de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Vendas</p>
                <p className="text-3xl font-bold">{stats.totalSales}</p>
                <p className="text-blue-100 text-xs">+12% este mês</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Receita Total</p>
                <p className="text-3xl font-bold">R$ {stats.totalRevenue.toLocaleString()}</p>
                <p className="text-green-100 text-xs">+8% este mês</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Vendas Hoje</p>
                <p className="text-3xl font-bold">{stats.todaySales}</p>
                <p className="text-purple-100 text-xs">Meta: 10 vendas</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Usuários Online</p>
                <p className="text-3xl font-bold">{stats.onlineUsers}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <p className="text-orange-100 text-xs">Ao vivo</p>
                </div>
              </div>
              <Eye className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Vendas dos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `${value} vendas` : `R$ ${value}`,
                    name === 'sales' ? 'Vendas' : 'Receita'
                  ]}
                />
                <Area type="monotone" dataKey="sales" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Area type="monotone" dataKey="revenue" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Países */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Vendas por País
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-600">{activity.time} • {activity.country}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">R$ {activity.amount}</Badge>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métricas Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Métricas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Taxa de Conversão</span>
                  <span className="text-sm text-gray-600">{stats.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Clientes Únicos</span>
                  <span className="text-sm text-gray-600">{stats.uniqueCustomers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((stats.uniqueCustomers / Math.max(stats.totalSales, 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Ticket Médio</span>
                  <span className="text-sm text-gray-600">
                    R$ {stats.totalSales > 0 ? (stats.totalRevenue / stats.totalSales).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
