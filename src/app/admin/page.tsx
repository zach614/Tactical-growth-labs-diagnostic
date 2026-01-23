'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Submission {
  id: string;
  createdAt: string;
  firstName: string;
  email: string;
  storeUrl: string;
  monthlyRevenueRange: string | null;
  sessions30d: number;
  orders30d: number;
  conversionRate: number;
  aov: number;
  cartAbandonRate: number;
  revenueEst: number;
  revenuePerSession: number;
  leakScore: number;
  topLeak1: string;
  topLeak2: string;
  emailSentAt: string | null;
  ownerNotifiedAt: string | null;
  ghlSyncedAt: string | null;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Check for existing session
  useEffect(() => {
    const sessionToken = sessionStorage.getItem('admin_token');
    if (sessionToken) {
      verifyToken(sessionToken);
    }
  }, []);

  // Load submissions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated]);

  // Auto-select highlighted submission
  useEffect(() => {
    if (highlightId && submissions.length > 0) {
      const submission = submissions.find((s) => s.id === highlightId);
      if (submission) {
        setSelectedSubmission(submission);
      }
    }
  }, [highlightId, submissions]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin_token');
      }
    } catch {
      sessionStorage.removeItem('admin_token');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_token');
      }
    } catch {
      console.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setSubmissions([]);
    setSelectedSubmission(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-600 bg-red-100';
    if (score < 70) return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-olive-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">TGL</span>
              </div>
              <h1 className="text-2xl font-bold text-stone-900">Admin Access</h1>
              <p className="text-stone-500 mt-2">Enter your password to continue</p>
            </div>

            <form onSubmit={handleLogin}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className="btn-primary w-full"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-olive-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TGL</span>
              </div>
              <span className="font-semibold text-stone-900">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadSubmissions}
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submissions list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200">
              <div className="p-4 border-b border-stone-200">
                <h2 className="font-semibold text-stone-900">
                  Submissions ({submissions.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center text-stone-500">Loading...</div>
              ) : submissions.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  No submissions yet
                </div>
              ) : (
                <div className="divide-y divide-stone-200">
                  {submissions.map((submission) => (
                    <button
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`w-full p-4 text-left hover:bg-stone-50 transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? 'bg-olive-50'
                          : ''
                      } ${highlightId === submission.id ? 'ring-2 ring-olive-500' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-stone-900">
                            {submission.firstName}
                          </p>
                          <p className="text-sm text-stone-500">
                            {submission.storeUrl.replace('https://', '')}
                          </p>
                          <p className="text-xs text-stone-400 mt-1">
                            {formatDate(submission.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(
                            submission.leakScore
                          )}`}
                        >
                          {submission.leakScore}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selectedSubmission ? (
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 sticky top-8">
                <div className="p-4 border-b border-stone-200">
                  <h2 className="font-semibold text-stone-900">
                    Submission Details
                  </h2>
                </div>

                <div className="p-4 space-y-4">
                  {/* Contact */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                      Contact
                    </p>
                    <p className="font-medium">{selectedSubmission.firstName}</p>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-sm text-olive-600 hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                    <a
                      href={selectedSubmission.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-olive-600 hover:underline"
                    >
                      {selectedSubmission.storeUrl.replace('https://', '')}
                    </a>
                  </div>

                  {/* Score */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                      Leak Score
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-lg font-bold ${getScoreColor(
                        selectedSubmission.leakScore
                      )}`}
                    >
                      {selectedSubmission.leakScore}/100
                    </span>
                  </div>

                  {/* Metrics */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                      Metrics
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-stone-50 rounded p-2">
                        <p className="text-stone-500">Sessions</p>
                        <p className="font-medium">
                          {selectedSubmission.sessions30d.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded p-2">
                        <p className="text-stone-500">Orders</p>
                        <p className="font-medium">
                          {selectedSubmission.orders30d.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded p-2">
                        <p className="text-stone-500">Conv Rate</p>
                        <p className="font-medium">
                          {selectedSubmission.conversionRate}%
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded p-2">
                        <p className="text-stone-500">AOV</p>
                        <p className="font-medium">
                          ${selectedSubmission.aov.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded p-2 col-span-2">
                        <p className="text-stone-500">Cart Abandon</p>
                        <p className="font-medium">
                          {selectedSubmission.cartAbandonRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top Leaks */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                      Top Leaks
                    </p>
                    <div className="space-y-2">
                      <div className="bg-red-50 rounded p-2 text-sm">
                        <span className="font-medium text-red-700">1.</span>{' '}
                        {selectedSubmission.topLeak1}
                      </div>
                      {selectedSubmission.topLeak2 !== 'None' && (
                        <div className="bg-amber-50 rounded p-2 text-sm">
                          <span className="font-medium text-amber-700">2.</span>{' '}
                          {selectedSubmission.topLeak2}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Revenue */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                      Est. Revenue
                    </p>
                    <p className="text-2xl font-bold text-olive-700">
                      ${selectedSubmission.revenueEst.toLocaleString()}
                      <span className="text-sm font-normal text-stone-500">
                        /mo
                      </span>
                    </p>
                    <p className="text-sm text-stone-500">
                      ${selectedSubmission.revenuePerSession.toFixed(2)} per
                      session
                    </p>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                      Status
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        {selectedSubmission.emailSentAt ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-stone-400">○</span>
                        )}
                        <span>Report emailed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedSubmission.ownerNotifiedAt ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-stone-400">○</span>
                        )}
                        <span>Owner notified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedSubmission.ghlSyncedAt ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-stone-400">○</span>
                        )}
                        <span>GHL synced</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="pt-4 border-t border-stone-200 text-xs text-stone-400">
                    Submitted {formatDate(selectedSubmission.createdAt)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center text-stone-500">
                Select a submission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
