'use client';

import { useState, useEffect } from 'react';
import { LuNewspaper, LuExternalLink, LuCalendar, LuRefreshCw, LuTriangleAlert, LuWaves, LuCloudRain, LuWind } from 'react-icons/lu';
import { fetchIndiaCoastalNews, NewsArticle } from '../services/indiaNewsApi';

interface NewsSectionProps {
  className?: string;
}

export default function NewsSection({ className = '' }: NewsSectionProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const newsData = await fetchIndiaCoastalNews();
      setNews(newsData);
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleRefresh = () => {
    loadNews(true);
  };

  const getDisasterIcon = (title: string, description: string) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('tsunami') || text.includes('tidal wave')) {
      return <LuWaves className="h-5 w-5 text-blue-600" />;
    } else if (text.includes('storm') || text.includes('hurricane') || text.includes('cyclone')) {
      return <LuWind className="h-5 w-5 text-gray-600" />;
    } else if (text.includes('flood') || text.includes('flooding')) {
      return <LuCloudRain className="h-5 w-5 text-blue-500" />;
    } else {
      return <LuTriangleAlert className="h-5 w-5 text-orange-500" />;
    }
  };

  const getDisasterType = (title: string, description: string) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('tsunami')) return 'Tsunami';
    if (text.includes('hurricane') || text.includes('cyclone') || text.includes('typhoon')) return 'Storm';
    if (text.includes('flood')) return 'Flood';
    if (text.includes('tide')) return 'High Tide';
    return 'Ocean Hazard';
  };

  const getDisasterColor = (type: string) => {
    switch (type) {
      case 'Tsunami':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Storm':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Flood':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High Tide':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <section className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
              <LuNewspaper className="h-4 w-4" />
            </span>
            Latest India Coastal Disaster News
          </h2>
          <p className="text-sm text-gray-500 mt-1">Recent news about India's coastal ocean hazards, storms, floods, and high tides</p>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-600">
                <LuNewspaper className="h-4 w-4" />
              </span>
              Latest India Coastal Disaster News
            </h2>
            <p className="text-sm text-gray-500 mt-1">Recent news about India's coastal ocean hazards, storms, floods, and high tides (Last 2 days)</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-60"
          >
            <LuRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        
        {news.length > 0 && news[0].url.includes('example.com') && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> No recent India coastal disaster news found in the last 2 days. 
              Showing sample data to demonstrate the feature.
            </p>
          </div>
        )}
        
        {news.length === 0 && !error ? (
          <div className="text-center py-8">
            <LuNewspaper className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent India coastal disaster news found</p>
            <p className="text-sm text-gray-400 mt-1">Try refreshing to get the latest updates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((article, index) => {
              const disasterType = getDisasterType(article.title, article.description);
              const disasterColor = getDisasterColor(disasterType);
              
              return (
                <article key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getDisasterIcon(article.title, article.description)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded border ${disasterColor}`}>
                            {disasterType}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <LuCalendar className="h-3.5 w-3.5" />
                            {formatTimeAgo(article.publishedAt)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {article.source.name}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {article.author && (
                            <span>By {article.author}</span>
                          )}
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read More
                          <LuExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
