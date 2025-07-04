import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch all waitlist data
    const { data: waitlistData, error } = await supabase
      .from('footsteps-waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    // Process the data for analytics
    const totalSignups = waitlistData.length
    
    // Feature analysis
    const featureAnalysis: { [key: string]: { count: number; users: string[] } } = {}
    
    // Comments with user info
    const commentsData = waitlistData
      .filter(item => item.comments && item.comments.trim() !== '')
      .map(item => ({
        email: item.email,
        comment: item.comments,
        created_at: item.created_at,
        suggested_features: item.suggested_feature || []
      }))

    // Process feature data
    waitlistData.forEach(item => {
      if (item.suggested_feature && Array.isArray(item.suggested_feature)) {
        item.suggested_feature.forEach((feature: string) => {
          if (!featureAnalysis[feature]) {
            featureAnalysis[feature] = { count: 0, users: [] }
          }
          featureAnalysis[feature].count++
          featureAnalysis[feature].users.push(item.email)
        })
      }
    })

    // Sort features by popularity
    const sortedFeatures = Object.entries(featureAnalysis)
      .map(([feature, data]) => ({
        feature,
        count: data.count,
        percentage: ((data.count / totalSignups) * 100).toFixed(1),
        users: data.users
      }))
      .sort((a, b) => b.count - a.count)

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentSignups = waitlistData.filter(item => 
      new Date(item.created_at) > sevenDaysAgo
    ).length

    // Daily signups for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const dailySignups: { [key: string]: number } = {}
    waitlistData.forEach(item => {
      const signupDate = new Date(item.created_at)
      if (signupDate > thirtyDaysAgo) {
        const dateKey = signupDate.toISOString().split('T')[0]
        dailySignups[dateKey] = (dailySignups[dateKey] || 0) + 1
      }
    })

    const response = {
      summary: {
        totalSignups,
        recentSignups,
        totalComments: commentsData.length,
        featuresSelected: sortedFeatures.length
      },
      features: sortedFeatures,
      comments: commentsData,
      dailySignups: Object.entries(dailySignups)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      rawData: waitlistData
    }

    return NextResponse.json({ success: true, data: response })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch analytics data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 