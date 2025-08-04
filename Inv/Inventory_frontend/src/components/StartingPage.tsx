import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ArrowRight, Users, BarChart3, Shield } from 'lucide-react';

const StartingPage: React.FC = () => {
  const { setShowStartingPage } = useAuth();

  const handleGetStarted = () => {
    setShowStartingPage(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Stock Buddy
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Smart Inventory
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 leading-snug">
              Management Partner
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your inventory operations with Stock Buddy - the intelligent solution
            for sales teams to manage products, track sales, and grow your business efficiently.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Inventory</h3>
            <p className="text-gray-600">
              Manage your product catalog with real-time stock tracking, automated alerts,
              and intelligent categorization for optimal organization.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Management</h3>
            <p className="text-gray-600">
              Build stronger relationships with comprehensive customer profiles,
              purchase history, and personalized service capabilities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sales Analytics</h3>
            <p className="text-gray-600">
              Track performance with detailed sales reports, revenue insights,
              and data-driven recommendations to boost your business growth.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-12 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-6">Built for Sales Excellence</h3>
            <p className="text-xl text-blue-100 mb-8">
              Stock Buddy empowers sales teams with the tools they need to succeed.
              From inventory management to customer relationships, everything is designed
              to help you sell more and work smarter.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-blue-100">Uptime Reliability</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Support Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Secure</div>
                <div className="text-blue-100">Data Protection</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 Stock Buddy. Built for modern sales teams.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StartingPage;
