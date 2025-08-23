'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Affiliate {
  id: number;
  name: string;
}

export default function PostbackUrlPage() {
  const params = useParams();
  const router = useRouter();
  const affiliateId = params.affiliate_id as string;
  
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = 'http://localhost:3001';
  const postbackUrl = `${baseUrl}/postback?affiliate_id=${affiliateId}&click_id={click_id}&amount={amount}&currency={currency}`;

  useEffect(() => {
    if (affiliateId) {
      fetchAffiliate();
    }
  }, [affiliateId]);

  const fetchAffiliate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/affiliates/${affiliateId}/clicks`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setAffiliate(data.data.affiliate);
      } else {
        setError('Failed to fetch affiliate data');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postbackUrl);
      alert('Postback URL copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postbackUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Postback URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading affiliate data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Postback URL for {affiliate?.name}
              </h1>
              <p className="text-gray-600">Affiliate ID: {affiliateId}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/dashboard/${affiliateId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Postback URL Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Your Postback URL
              </h3>
              <p className="text-sm text-gray-600">
                Use this URL to track conversions from your affiliate partners. Replace the placeholder values with actual data.
              </p>
            </div>

            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <code className="text-sm text-gray-800 break-all">{postbackUrl}</code>
                <button
                  onClick={copyToClipboard}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Parameters Explanation */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">URL Parameters</h4>
              <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">affiliate_id</td>
                      <td className="px-4 py-3 text-sm text-gray-500">Your affiliate ID (fixed)</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{affiliateId}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">click_id</td>
                      <td className="px-4 py-3 text-sm text-gray-500">Unique click identifier from your tracking</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">abc123</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">amount</td>
                      <td className="px-4 py-3 text-sm text-gray-500">Conversion amount (positive number)</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">99.99</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">currency</td>
                      <td className="px-4 py-3 text-sm text-gray-500">Currency code (3 letters)</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">USD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Example Usage */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Example Usage</h4>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800 mb-2">
                  <strong>Example postback call:</strong>
                </p>
                <code className="text-sm text-green-700 break-all">
                  {baseUrl}/postback?affiliate_id={affiliateId}&click_id=xyz789&amount=149.99&currency=USD
                </code>
              </div>
            </div>

            {/* How It Works */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">How It Works</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium mr-3 mt-0.5">1</span>
                    <span>Your affiliate partner sends a user to your offer with a unique click_id</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium mr-3 mt-0.5">2</span>
                    <span>When the user converts, call the postback URL with the click_id and conversion details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium mr-3 mt-0.5">3</span>
                    <span>The system validates the click and records the conversion in your dashboard</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Test Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Test Your Postback</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can test your postback URL by making a test conversion call. Make sure you have a valid click_id first.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> To test conversions, you need to first create a click using the click tracking endpoint:
              </p>
              <code className="text-sm text-yellow-700 block mt-2 break-all">
                {baseUrl}/click?affiliate_id={affiliateId}&campaign_id=1&click_id=test123
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}