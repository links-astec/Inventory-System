import React from 'react';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

interface DiscountRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  isActive: boolean;
}

interface WorkingDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Feature {
  key: string;
  label: string;
  enabled: boolean;
}

interface SettingsProps {
  handleSaveSettings: () => void;
  currencyOptions: Array<{ code: string; symbol: string; name: string }>;
  selectedCurrency: string;
  updateCurrency: (currency: string) => void;
  timeZones: Array<{ id: string; name: string; offset: string }>;
  selectedTimeZone: string;
  updateTimeZone: (zone: string) => void;
  taxRates: TaxRate[];
  setDefaultTaxRate: (id: string) => void;
  discountRules: DiscountRule[];
  toggleDiscountRule: (id: string) => void;
  workingHours: WorkingDay[];
  toggleWorkingDay: (day: string) => void;
  updateWorkingHours: (day: string, hours: { openTime?: string; closeTime?: string }) => void;
  features: Feature[];
  toggleFeature: (key: string) => void;
  getTheme: () => { primaryBg: string; primaryHoverBg: string };
}

const SettingsSection: React.FC<SettingsProps> = ({
  handleSaveSettings,
  currencyOptions,
  selectedCurrency,
  updateCurrency,
  timeZones,
  selectedTimeZone,
  updateTimeZone,
  taxRates,
  setDefaultTaxRate,
  discountRules,
  toggleDiscountRule,
  workingHours,
  toggleWorkingDay,
  updateWorkingHours,
  features,
  toggleFeature,
  getTheme
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <button 
          onClick={handleSaveSettings} 
          className={`${getTheme().primaryBg} hover:${getTheme().primaryHoverBg} text-white px-4 py-2 rounded-lg font-semibold`}
        >
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency & Time Zone */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Currency & Time Zone</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                value={selectedCurrency} 
                onChange={e => updateCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                aria-label="Select Currency"
              >
                {currencyOptions.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
              <select 
                value={selectedTimeZone} 
                onChange={e => updateTimeZone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                aria-label="Select Time Zone"
              >
                {timeZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.offset})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tax Rates */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Rates</h3>
          <div className="space-y-3">
            {taxRates.map(tax => (
              <div key={tax.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">{tax.name}</span>
                  <span className="text-gray-600 ml-2">({tax.rate}%)</span>
                  {tax.isDefault && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                      Default
                    </span>
                  )}
                </div>
                {!tax.isDefault && (
                  <button 
                    onClick={() => setDefaultTaxRate(tax.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Set Default
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Management */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Feature Management</h3>
          <div className="space-y-3">
            {features.map(feature => (
              <div key={feature.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{feature.label}</label>
                <input 
                  type="checkbox" 
                  checked={feature.enabled} 
                  onChange={() => toggleFeature(feature.key)}
                  className="rounded" 
                  aria-label={`Toggle ${feature.label}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discount Rules */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Discount Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discountRules.map(rule => (
            <div 
              key={rule.id} 
              className={`border rounded-lg p-4 ${
                rule.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{rule.name}</h4>
                <button
                  onClick={() => toggleDiscountRule(rule.id)}
                  className={`text-sm px-2 py-1 rounded ${
                    rule.isActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {rule.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {rule.type === 'percentage' ? `${rule.value}% off` : `${selectedCurrency === 'GHS' ? 'GH₵' : '$'}${rule.value} off`}
                {rule.minAmount && ` (min: ${selectedCurrency === 'GHS' ? 'GH₵' : '$'}${rule.minAmount})`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
        <div className="space-y-3">
          {workingHours.map(day => (
            <div key={day.day} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={day.isOpen}
                  onChange={() => toggleWorkingDay(day.day)}
                  className="rounded"
                  aria-label={`Toggle ${day.day}`}
                />
                <span className="font-medium w-20">{day.day}</span>
              </div>
              {day.isOpen && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={day.openTime}
                    onChange={e => updateWorkingHours(day.day, { openTime: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    aria-label={`${day.day} open time`}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={day.closeTime}
                    onChange={e => updateWorkingHours(day.day, { closeTime: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    aria-label={`${day.day} close time`}
                  />
                </div>
              )}
              {!day.isOpen && (
                <span className="text-gray-500 italic">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
