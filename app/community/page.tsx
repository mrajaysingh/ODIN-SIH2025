'use client';

import { useState } from 'react';
import {
  LuTrendingUp,
  LuMessageSquare,
  LuHash,
  LuRefreshCw,
  LuTwitter,
  LuInstagram,
  LuFacebook,
  LuClock,
  LuUsers,
  LuEye,
  LuBell,
} from 'react-icons/lu';

export default function CommunityPage() {
  const [refreshing, setRefreshing] = useState(false);

  const socialFeeds = [
    {
      id: 1,
      platform: 'Twitter',
      author: '@CoastalWatch_IN',
      content:
        'High tide warning issued for Mumbai coast. Residents advised to avoid low-lying areas. #TsunamiAlert #MumbaiTide',
      timestamp: '15 mins ago',
      engagement: 234,
      sentiment: 'urgent',
      verified: true,
    },
    {
      id: 2,
      platform: 'Instagram',
      author: '@chennai_fishermen',
      content:
        'Storm clouds gathering over Marina Beach. Fishermen returning to shore immediately. Stay safe everyone! 🌊⚠️',
      timestamp: '32 mins ago',
      engagement: 89,
      sentiment: 'concerned',
      verified: false,
    },
    {
      id: 3,
      platform: 'Facebook',
      author: 'Goa Tourism Safety',
      content:
        'Current situation at Baga Beach: Strong rip currents detected. Swimming temporarily prohibited. Lifeguards on high alert.',
      timestamp: '1 hour ago',
      engagement: 156,
      sentiment: 'alert',
      verified: true,
    },
    {
      id: 4,
      platform: 'Twitter',
      author: '@INCOIS_Official',
      content:
        'Sea level monitoring stations report abnormal readings along Andhra Pradesh coast. Advisory issued to coastal districts.',
      timestamp: '2 hours ago',
      engagement: 445,
      sentiment: 'official',
      verified: true,
    },
  ];

  const trendingHashtags = [
    { tag: '#TsunamiAlert', count: 2340, change: '+45%' },
    { tag: '#CoastalSafety', count: 1890, change: '+32%' },
    { tag: '#HighTide', count: 1567, change: '+28%' },
    { tag: '#StormWarning', count: 1234, change: '+15%' },
    { tag: '#OceanSafety', count: 987, change: '+8%' },
    { tag: '#DisasterPrep', count: 756, change: '+12%' },
    { tag: '#WeatherAlert', count: 645, change: '-5%' },
    { tag: '#CoastGuard', count: 534, change: '+22%' },
  ];

  const sentimentData = [
    { category: 'Urgent/Emergency', percentage: 35, color: 'bg-red-500' },
    { category: 'Concerned/Alert', percentage: 28, color: 'bg-orange-500' },
    { category: 'Informational', percentage: 25, color: 'bg-blue-500' },
    { category: 'Positive/Safe', percentage: 12, color: 'bg-green-500' },
  ];

  const timelineData = [
    { time: '6 AM', mentions: 45 },
    { time: '9 AM', mentions: 78 },
    { time: '12 PM', mentions: 156 },
    { time: '3 PM', mentions: 234 },
    { time: '6 PM', mentions: 189 },
    { time: '9 PM', mentions: 123 },
    { time: 'Now', mentions: 98 },
  ];
  const maxMentions = Math.max(1, ...timelineData.map((p) => p.mentions));

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'concerned':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'alert':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'official':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const PlatformIcon = ({ name, className }: { name: string; className?: string }) => {
    switch (name) {
      case 'Twitter':
        return <LuTwitter className={className ?? ''} />;
      case 'Instagram':
        return <LuInstagram className={className ?? ''} />;
      case 'Facebook':
        return <LuFacebook className={className ?? ''} />;
      default:
        return <LuUsers className={className ?? ''} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Social Media Insights</h1>
                <p className="text-gray-600 text-sm sm:text-base">AI-powered analysis of ocean hazard discussions</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-60"
              >
                <LuRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Live Social Feed */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
                      <LuMessageSquare className="h-4 w-4" />
                    </span>
                    Live Social Media Feed
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Real-time posts and updates about ocean hazards (AI filtered and summarized)</p>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {socialFeeds.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                              <PlatformIcon name={post.platform} className="h-3.5 w-3.5" />
                              {post.platform}
                            </span>
                            <span className="font-medium text-gray-800">{post.author}</span>
                            {post.verified && (
                              <span className="text-blue-600" title="Verified">✔︎</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded border ${getSentimentColor(post.sentiment)}`}>
                              {post.sentiment}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1" title="Timestamp">
                              <LuClock className="h-3.5 w-3.5" /> {post.timestamp}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 whitespace-pre-line">{post.content}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center gap-1"><LuEye className="h-4 w-4" /> {post.engagement} engagements</span>
                          <button className="px-2 py-1 rounded hover:bg-gray-100">View Original</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Sentiment Analysis */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
                      <LuTrendingUp className="h-4 w-4" />
                    </span>
                    Sentiment Analysis
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Emotional tone of ocean hazard discussions across platforms</p>
                </div>
                <div className="p-4 space-y-4">
                  {sentimentData.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-800">{item.category}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Trending Timeline */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
                      <LuTrendingUp className="h-4 w-4" />
                    </span>
                    Mention Timeline (Last 24 Hours)
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Volume of hazard-related discussions over time</p>
                </div>
                <div className="p-4">
                  <div className="h-48 relative">
                    {/* Axes */}
                    <div className="absolute left-6 top-2 bottom-8 w-px bg-gray-200" />
                    <div className="absolute left-6 right-2 bottom-8 h-px bg-gray-200" />

                    {/* Horizontal grid lines and labels */}
                    {[0.25, 0.5, 0.75, 1].map((ratio) => (
                      <div key={ratio} className="absolute left-6 right-2" style={{ bottom: `${8 + ratio * 140}px` }}>
                        <div className="h-px bg-gray-100" />
                        <div className="absolute -left-6 -translate-y-2 text-[10px] text-gray-500">
                          {Math.round(maxMentions * ratio)}
                        </div>
                      </div>
                    ))}

                    {/* Bars */}
                    <div className="absolute left-8 right-2 bottom-8 flex items-end justify-between gap-3">
                      {timelineData.map((point, idx) => {
                        const heightPx = Math.max(6, Math.round((point.mentions / maxMentions) * 140));
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 shadow-sm"
                              style={{ height: `${heightPx}px` }}
                              aria-label={`${point.time} mentions: ${point.mentions}`}
                            />
                            <div className="text-[10px] sm:text-xs text-gray-600 mt-2 whitespace-nowrap">{point.time}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Axis labels */}
                    <div className="absolute right-2 top-2 text-xs text-gray-500">Mentions</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Trending Hashtags */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
                      <LuHash className="h-4 w-4" />
                    </span>
                    Trending Hashtags
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Most discussed tags in the last 6 hours</p>
                </div>
                <div className="p-4 space-y-3">
                  {trendingHashtags.map((hashtag, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-blue-700">{hashtag.tag}</div>
                        <div className="text-sm text-gray-600">{hashtag.count.toLocaleString()} mentions</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${hashtag.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{hashtag.change}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Platform Breakdown */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
                      <LuUsers className="h-4 w-4" />
                    </span>
                    Platform Activity
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { name: 'Twitter', color: 'text-blue-500', value: 2340, change: '+15%' },
                    { name: 'Facebook', color: 'text-blue-600', value: 1890, change: '+8%' },
                    { name: 'Instagram', color: 'text-pink-500', value: 1234, change: '+22%' },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformIcon name={p.name} className={`h-4 w-4 ${p.color}`} />
                        <span className="text-gray-800">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{p.value.toLocaleString()}</div>
                        <div className="text-xs text-green-600">{p.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* AI Insights */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-orange-100 text-orange-600">
                      <LuBell className="h-4 w-4" />
                    </span>
                    AI Insights
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <div className="text-sm text-red-800 font-medium mb-1">Critical Alert Detected</div>
                    <div className="text-xs text-red-600">Spike in tsunami-related mentions in Andhra Pradesh region (3x normal)</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded border border-orange-200">
                    <div className="text-sm text-orange-800 font-medium mb-1">Rising Concern</div>
                    <div className="text-xs text-orange-600">Increased fishermen safety discussions in Tamil Nadu coastal areas</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <div className="text-sm text-blue-800 font-medium mb-1">Positive Trend</div>
                    <div className="text-xs text-blue-600">More coastal communities sharing safety awareness content</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


