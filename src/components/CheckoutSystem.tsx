
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckoutForm } from './CheckoutForm';
import { SecurityAlert } from './SecurityAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSecurity } from '../hooks/useSecurity';
import { getTranslation, formatCurrency } from '../i18n/translations';
import { defaultConfig } from '../config/checkout-config';
import { Shield, Clock, Headphones, CheckCircle, Star, Users, Award } from 'lucide-react';

const stripePromise = loadStripe(defaultConfig.stripePublishableKey);

export const CheckoutSystem: React.FC = () => {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  const geoData = useGeolocation(defaultConfig.currency);
  const { language, currency, convertPrice, loading: geoLoading } = geoData;

  // Initialize security
  useSecurity({
    ...defaultConfig.securityFeatures,
    alertMessage: getTranslation(language, 'securityAlert')
  });

  // Listen for security alerts
  useEffect(() => {
    const handleSecurityAlert = (event: CustomEvent) => {
      setSecurityAlert(event.detail.message);
      setTimeout(() => setSecurityAlert(null), 5000);
    };

    window.addEventListener('securityAlert', handleSecurityAlert as EventListener);
    return () => window.removeEventListener('securityAlert', handleSecurityAlert as EventListener);
  }, []);

  const t = (key: string) => getTranslation(language, key);

  const originalPrice = convertPrice(defaultConfig.originalPrice);
  const salePrice = convertPrice(defaultConfig.salePrice);
  const discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerData.name && customerData.email && customerData.phone) {
      setShowPayment(true);
    }
  };

  const testimonials = [
    {
      name: "Maria Silva",
      rating: 5,
      comment: language === 'pt' ? "Produto incrível! Superou minhas expectativas." : "Amazing product! Exceeded my expectations."
    },
    {
      name: "John Smith", 
      rating: 5,
      comment: language === 'pt' ? "Excelente qualidade e suporte fantástico." : "Excellent quality and fantastic support."
    },
    {
      name: "Carlos Rodriguez",
      rating: 5,
      comment: language === 'pt' ? "Recomendo para todos os profissionais." : "I recommend it to all professionals."
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: language === 'pt' ? "Qualidade Premium" : "Premium Quality",
      description: language === 'pt' ? "Produto desenvolvido com os mais altos padrões" : "Product developed with the highest standards"
    },
    {
      icon: Shield,
      title: language === 'pt' ? "100% Seguro" : "100% Secure",
      description: language === 'pt' ? "Pagamento protegido e dados criptografados" : "Protected payment and encrypted data"
    },
    {
      icon: Award,
      title: language === 'pt' ? "Garantia Total" : "Full Guarantee",
      description: language === 'pt' ? "30 dias de garantia incondicional" : "30-day unconditional guarantee"
    },
    {
      icon: Headphones,
      title: language === 'pt' ? "Suporte 24/7" : "24/7 Support",
      description: language === 'pt' ? "Atendimento especializado sempre disponível" : "Specialized service always available"
    }
  ];

  if (geoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {securityAlert && <SecurityAlert message={securityAlert} />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Limited Time Offer */}
        <div className="text-center mb-8">
          <Badge variant="destructive" className="mb-4 px-4 py-2 text-lg animate-pulse">
            <Clock className="w-4 h-4 mr-2" />
            {t('limitedTime')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('productTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('productDescription')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="shadow-2xl border-2 border-yellow-400">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <CardTitle className="text-2xl font-bold text-center">
                  {t('limitedTime')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-2xl text-gray-500 line-through">
                      {formatCurrency(originalPrice, currency, language)}
                    </span>
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      -{discountPercentage}%
                    </Badge>
                  </div>
                  <div className="text-5xl font-bold text-green-600">
                    {formatCurrency(salePrice, currency, language)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('currency')}: {currency}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  {t('features')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <feature.icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex justify-center space-x-6 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">{t('securePayment')}</span>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">{t('guarantee')}</span>
              </div>
              <div className="flex flex-col items-center">
                <Headphones className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">{t('support')}</span>
              </div>
            </div>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {t('testimonials')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                        <span className="ml-2 font-semibold">{testimonial.name}</span>
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {t('orderSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPayment ? (
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('customerName')}</Label>
                      <Input
                        id="name"
                        type="text"
                        value={customerData.name}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('customerNamePlaceholder')}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">{t('customerEmail')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder={t('customerEmailPlaceholder')}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">{t('customerPhone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder={t('customerPhonePlaceholder')}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">{t('total')}:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(salePrice, currency, language)}
                        </span>
                      </div>
                      
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                        {t('processPayment')}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      customerData={customerData}
                      amount={Math.round(salePrice * 100)}
                      currency={currency.toLowerCase()}
                      language={language}
                    />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
