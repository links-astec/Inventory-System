// src/components/Login.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Package, Shield, Users } from 'lucide-react';
import {  registerAdmin } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ import this
import { useErrorHandler } from '../hooks/useErrorHandler';
import ToastContainer from './ToastContainer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use context login function
  const { errors, removeError, handleApiError, showSuccess } = useErrorHandler();

  const [loginType, setLoginType] = useState<'admin' | 'sales'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, loginType, accessToken); // ✅ context handles both admin/sales
      showSuccess('Login successful! Redirecting...');
      navigate(loginType === 'admin' ? '/admin' : '/sales'); // ✅ redirect appropriately
    } catch (err: any) {
      // Better error handling for salesperson authentication
      if (loginType === 'sales') {
        if (err.message && err.message.includes('Invalid token')) {
          handleApiError(new Error('Invalid or expired access token. Please generate a new token.'), 'Salesperson login');
        } else if (err.message && err.message.includes('Token has already been used')) {
          handleApiError(new Error('This access token has already been used. Please generate a new token.'), 'Salesperson login');
        } else if (err.message && err.message.includes('Invalid credentials')) {
          handleApiError(new Error('Invalid email or password. If this is your first time, a new account will be created with these credentials.'), 'Salesperson login');
        } else {
          handleApiError(err, 'Salesperson login');
        }
      } else {
        handleApiError(err, 'Admin login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerAdmin(signUpEmail, signUpPassword);
      showSuccess('Admin account created successfully! You can now login.');
      setShowSignUp(false);
      setSignUpEmail('');
      setSignUpPassword('');
    } catch (err: any) {
      handleApiError(err, 'Admin registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Buddy</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="h-4 w-4" />
            Administrator
          </button>
          <button
            type="button"
            onClick={() => setLoginType('sales')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'sales'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4" />
            Sales Personnel
          </button>
        </div>

        {!showSignUp && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {loginType === 'sales' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">📋 Sales Personnel Login Instructions</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• First time? Enter your email and create a password</li>
                  <li>• Returning user? Use your existing email and password</li>
                  <li>• You need a valid access token from your administrator</li>
                  <li>• Each token can only be used once</li>
                </ul>
              </div>
            )}

            {loginType === 'sales' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter access token from your admin"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  🔑 Contact your administrator to get an access token.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {showSignUp && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" /> Admin Sign Up
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Create Admin Account
            </button>
            <button
              type="button"
              onClick={() => setShowSignUp(false)}
              className="w-full mt-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              Back to Login
            </button>
          </form>
        )}

        {!showSignUp && loginType === 'admin' && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowSignUp(true)}
              className="inline-flex items-center gap-2 bg-white text-blue-600 border border-blue-600 font-semibold px-6 py-2 rounded-lg text-base transition hover:bg-blue-50"
            >
              <Shield className="h-4 w-4" />
              Sign Up as Admin
            </button>
          </div>
        )}
      </div>
      <ToastContainer errors={errors} onRemove={removeError} />
    </div>
  );
};

export default Login;
