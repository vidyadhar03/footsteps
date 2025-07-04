'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AnalyticsData {
  summary: {
    totalSignups: number
    recentSignups: number
    totalComments: number
    featuresSelected: number
  }
  features: {
    feature: string
    count: number
    percentage: string
    users: string[]
  }[]
  comments: {
    email: string
    comment: string
    created_at: string
    suggested_features: string[]
  }[]
  dailySignups: {
    date: string
    count: number
  }[]
  rawData: any[]
}

export default function WaitlistAnalysis() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/waitlist/analytics')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Failed to fetch analytics data')
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFeatureUsers = (feature: string) => {
    return data?.features.find(f => f.feature === feature)?.users || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <button 
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Footsteps</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Waitlist Analytics</h1>
              <p className="text-gray-600">Real-time insights into your waitlist data</p>
            </div>
            <button 
              onClick={fetchAnalytics}
              disabled={refreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                refreshing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Signups</p>
                    <p className="text-3xl font-bold text-blue-600">{data.summary.totalSignups}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                    <p className="text-3xl font-bold text-green-600">{data.summary.recentSignups}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Comments</p>
                    <p className="text-3xl font-bold text-purple-600">{data.summary.totalComments}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Features</p>
                    <p className="text-3xl font-bold text-orange-600">{data.summary.featuresSelected}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Interest Analysis</h2>
                <p className="text-gray-600">Click on any feature to see interested users</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {data.features.map((feature, index) => (
                    <div key={feature.feature} className="relative">
                      <div 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => setSelectedFeature(selectedFeature === feature.feature ? null : feature.feature)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{feature.feature}</h3>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{feature.count} users</span>
                            <span className="text-sm text-blue-600 font-medium">{feature.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-4">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${feature.percentage}%` }}
                          ></div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            selectedFeature === feature.feature ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {selectedFeature === feature.feature && (
                        <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-900 mb-2">Interested Users ({feature.count})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {getFeatureUsers(feature.feature).map((email, idx) => (
                              <div key={idx} className="text-sm text-blue-700 bg-white px-3 py-1 rounded border">
                                {email}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">User Comments & Feedback</h2>
                <p className="text-gray-600">Insights and suggestions from your waitlist users</p>
              </div>
              <div className="p-6">
                {data.comments.length > 0 ? (
                  <div className="space-y-6">
                    {data.comments.map((comment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{comment.email}</h4>
                            <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                          </div>
                          {comment.suggested_features.length > 0 && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-1">Interested in:</p>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {comment.suggested_features.slice(0, 2).map((feature, idx) => (
                                  <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {feature.split(' ').slice(0, 2).join(' ')}...
                                  </span>
                                ))}
                                {comment.suggested_features.length > 2 && (
                                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    +{comment.suggested_features.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-gray-700 italic">"{comment.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500">No comments yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 