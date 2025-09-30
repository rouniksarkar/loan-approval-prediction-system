import React, { useState } from 'react';
import api from '../../services/api';

const PredictForm = () => {
  const [formData, setFormData] = useState({
    loan_percent_income: '',
    loan_int_rate: '',
    person_home_ownership_RENT: '0',
    loan_amnt: '',
    person_income: '',
    previous_loan_defaults_on_file: true
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const payload = {
        loan_percent_income: parseFloat(formData.loan_percent_income),
        loan_int_rate: parseFloat(formData.loan_int_rate),
        person_home_ownership_RENT: parseInt(formData.person_home_ownership_RENT),
        loan_amnt: parseFloat(formData.loan_amnt),
        person_income: parseFloat(formData.person_income),
        previous_loan_defaults_on_file: formData.previous_loan_defaults_on_file
      };

      const response = await api.post('/predict/', payload);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      loan_percent_income: '',
      loan_int_rate: '',
      person_home_ownership_RENT: '0',
      loan_amnt: '',
      person_income: '',
      previous_loan_defaults_on_file: true
    });
    setPrediction(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loan Approval Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in your financial details below to get an instant prediction about your loan approval chances
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {prediction && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Prediction Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-green-100">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {(prediction.probability * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-green-600 font-medium">Approval Probability</p>
                  </div>
                  <div className={`text-center p-6 rounded-xl shadow-lg border ${
                    prediction.prediction === "Approved" 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className={`text-3xl font-bold mb-2 ${
                      prediction.prediction === "Approved" ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {prediction.prediction}
                    </div>
                    <p className={`text-sm font-medium ${
                      prediction.prediction === "Approved" ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Loan Status
                    </p>
                  </div>
                </div>
                {prediction.prediction === "Approved" ? (
                  <p className="text-green-600 font-medium text-lg">
                    🎉 Congratulations! Your loan application looks promising.
                  </p>
                ) : (
                  <p className="text-red-600 font-medium text-lg">
                    💡 Consider improving your financial profile for better chances.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Financial Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Annual Income */}
              <div className="space-y-3">
                <label htmlFor="person_income" className="block text-sm font-semibold text-gray-700">
                  Annual Income ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="person_income"
                    name="person_income"
                    value={formData.person_income}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                    min="0"
                    step="1000"
                    placeholder="50,000"
                  />
                </div>
              </div>

              {/* Loan Amount */}
              <div className="space-y-3">
                <label htmlFor="loan_amnt" className="block text-sm font-semibold text-gray-700">
                  Loan Amount ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="loan_amnt"
                    name="loan_amnt"
                    value={formData.loan_amnt}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                    min="0"
                    step="100"
                    placeholder="10,000"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <label htmlFor="loan_int_rate" className="block text-sm font-semibold text-gray-700">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                  <input
                    type="number"
                    id="loan_int_rate"
                    name="loan_int_rate"
                    value={formData.loan_int_rate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                    min="0"
                    max="50"
                    step="0.1"
                    placeholder="5.5"
                  />
                </div>
              </div>

              {/* Loan Percent of Income */}
              <div className="space-y-3">
                <label htmlFor="loan_percent_income" className="block text-sm font-semibold text-gray-700">
                  Loan to Income Ratio (%)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                  <input
                    type="number"
                    id="loan_percent_income"
                    name="loan_percent_income"
                    value={formData.loan_percent_income}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="20.0"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Home Ownership */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Home Ownership Status
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                    <input
                      type="radio"
                      name="person_home_ownership_RENT"
                      value="1"
                      checked={formData.person_home_ownership_RENT === '1'}
                      onChange={handleChange}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">Renting</span>
                      <p className="text-sm text-gray-500">Currently renting a property</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                    <input
                      type="radio"
                      name="person_home_ownership_RENT"
                      value="0"
                      checked={formData.person_home_ownership_RENT === '0'}
                      onChange={handleChange}
                      className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">Home Owner</span>
                      <p className="text-sm text-gray-500">Own your home</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Credit History */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Credit History
                </label>
                <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    id="previous_loan_defaults_on_file"
                    name="previous_loan_defaults_on_file"
                    checked={formData.previous_loan_defaults_on_file}
                    onChange={handleChange}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-gray-700 font-medium">Clean Credit History</span>
                    <p className="text-sm text-gray-500">No previous loan defaults on record</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Your Application...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Check Approval Probability
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PredictForm;