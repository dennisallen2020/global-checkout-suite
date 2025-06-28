
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Globe, 
  Eye, 
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface OnlineUser {
  id: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  page: string;
  timeOnSite: number;
  lastActivity: Date;
  isNewVisitor: boolean;
}

export const OnlineUsers: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    generateMockUsers();
    
    const interval = setInterval(() => {
      updateUsersActivity();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateMockUsers = () => {
    const countries = [
      { name: 'Brasil', code: 'BR', cities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'] },
      { name: 'Estados Unidos', code: 'US', cities: ['New York', 'Los Angeles', 'Chicago'] },
      { name: 'Argentina', code: 'AR', cities: ['Buenos Aires', 'Córdoba', 'Rosario'] },
      { name: 'México', code: 'MX', cities: ['Ciudad de México', 'Guadalajara', 'Monterrey'] },
      { name: 'Colômbia', code: 'CO', cities: ['Bogotá', 'Medellín', 'Cali'] }
    ];

    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const devices: Array<'desktop' | 'mobile' | 'tablet'> = ['desktop', 'mobile', 'tablet'];
    const pages = ['/', '/checkout', '/admin'];

    const users: OnlineUser[] = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const city = country.cities[Math.floor(Math.random() * country.cities.length)];
      
      return {
        id: `user_${i}`,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: country.name,
        countryCode: country.code,
        city,
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        timeOnSite: Math.floor(Math.random() * 1800) + 60, // 1min a 30min
        lastActivity: new Date(Date.now() - Math.floor(Math.random() * 300000)), // últimos 5min
        isNewVisitor: Math.random() > 0.6
      };
    });

    setOnlineUsers(users);
    setTotalVisitors(Math.floor(Math.random() * 100) + 50);
    setPageViews(Math.floor(Math.random() * 500) + 200);
  };

  const updateUsersActivity = () => {
    setOnlineUsers(prev => {
      // Remover alguns usuários aleatoriamente
      let updatedUsers = prev.filter(() => Math.random() > 0.1);
      
      // Adicionar novos usuários ocasionalmente
      if (Math.random() > 0.7 && updatedUsers.length < 20) {
        const newUser = generateRandomUser();
        updatedUsers.push(newUser);
      }

      // Atualizar tempo dos usuários existentes
      updatedUsers = updatedUsers.map(user => ({
        ...user,
        timeOnSite: user.timeOnSite + 5,
        lastActivity: new Date()
      }));

      return updatedUsers;
    });

    // Atualizar contadores
    setTotalVisitors(prev => prev + Math.floor(Math.random() * 3));
    setPageViews(prev => prev + Math.floor(Math.random() * 5));
  };

  const generateRandomUser = (): OnlineUser => {
    const countries = [
      { name: 'Brasil', code: 'BR', cities: ['São Paulo', 'Rio de Janeiro'] },
      { name: 'Estados Unidos', code: 'US', cities: ['New York', 'Los Angeles'] }
    ];
    
    const country = countries[Math.floor(Math.random() * countries.length)];
    const browsers = ['Chrome', 'Firefox', 'Safari'];
    const devices: Array<'desktop' | 'mobile' | 'tablet'> = ['desktop', 'mobile', 'tablet'];
    
    return {
      id: `user_${Date.now()}_${Math.random()}`,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: country.name,
      countryCode: country.code,
      city: country.cities[0],
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      page: '/',
      timeOnSite: 0,
      lastActivity: new Date(),
      isNewVisitor: true
    };
  };

  const formatTimeOnSite = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getCountryFlag = (countryCode: string) => {
    return `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Usuários Online</p>
                <p className="text-3xl font-bold">{onlineUsers.length}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2"></div>
                  <p className="text-green-100 text-xs">Ao vivo</p>
                </div>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Visitantes Hoje</p>
                <p className="text-3xl font-bold">{totalVisitors}</p>
                <p className="text-blue-100 text-xs">+{Math.floor(Math.random() * 10)} novos</p>
              </div>
              <Eye className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Páginas Vistas</p>
                <p className="text-3xl font-bold">{pageViews}</p>
                <p className="text-purple-100 text-xs">Hoje</p>
              </div>
              <Globe className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários Online */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Usuários Online ({onlineUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {onlineUsers.length > 0 ? onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.country.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={getCountryFlag(user.countryCode)} 
                        alt={user.country}
                        className="w-4 h-3"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <span className="font-medium">{user.country}</span>
                      <span className="text-gray-500">• {user.city}</span>
                      {user.isNewVisitor && (
                        <Badge variant="secondary" className="text-xs">Novo</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      IP: {user.ip} • {user.browser} • Página: {user.page}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    {getDeviceIcon(user.device)}
                    <span className="capitalize">{user.device}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeOnSite(user.timeOnSite)}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum usuário online no momento</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
