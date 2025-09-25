'use client';

import { useState, useEffect, useRef } from 'react';
import { LuNewspaper, LuExternalLink, LuCalendar, LuRefreshCw, LuTriangleAlert, LuWaves, LuCloudRain, LuWind } from 'react-icons/lu';
import { fetchIndiaCoastalNews, NewsArticle } from '../services/indiaNewsApi';

interface AutoScrollNewsProps {
  className?: string;
}

export default function AutoScrollNews({ className = '' }: AutoScrollNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Auto-scroll functionality
  useEffect(() => {
    if (news.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
      }, 5000); // Change every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [news.length]);

  // Auto-fetch news every 10 minutes
  useEffect(() => {
    const fetchInterval = setInterval(() => {
      loadNews(true);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(fetchInterval);
  }, []);

  const handleRefresh = () => {
    loadNews(true);
  };

  const getDisasterIcon = (title: string, description: string) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('tsunami')) {
      return <LuWaves className="h-4 w-4 text-blue-600" />;
    } else if (text.includes('cyclone') || text.includes('storm')) {
      return <LuWind className="h-4 w-4 text-gray-600" />;
    } else if (text.includes('flood')) {
      return <LuCloudRain className="h-4 w-4 text-blue-500" />;
    } else {
      return <LuTriangleAlert className="h-4 w-4 text-orange-500" />;
    }
  };

  const getDisasterType = (title: string, description: string) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('tsunami')) return 'Tsunami';
    if (text.includes('cyclone')) return 'Cyclone';
    if (text.includes('flood')) return 'Flood';
    if (text.includes('tide')) return 'High Tide';
    if (text.includes('storm')) return 'Storm';
    return 'Alert';
  };

  const getDisasterColor = (type: string) => {
    switch (type) {
      case 'Tsunami':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cyclone':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Flood':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High Tide':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Storm':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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
      <div className={`bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4 h-[200px] sm:h-[250px] overflow-hidden flex flex-col ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <LuNewspaper className="h-4 w-4 text-blue-600" />
            India Coastal News
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[12px] sm:rounded-[16px] shadow-lg p-3 sm:p-4 h-[200px] sm:h-[250px] overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <LuNewspaper className="h-4 w-4 text-blue-600" />
          India Coastal News
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-60"
          title="Refresh News"
        >
          <LuRefreshCw className={`h-3 w-3 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
          {error}
        </div>
      )}
      
      {news.length > 0 && news[0].url.includes('example.com') && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>Note:</strong> Showing sample data. Real news updates every 10 minutes.
        </div>
      )}
      
      <div className="flex-1 overflow-hidden relative">
        {news.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <LuNewspaper className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No recent news found</p>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          >
            {news.map((article, index) => {
              const disasterType = getDisasterType(article.title, article.description);
              const disasterColor = getDisasterColor(disasterType);
              
              return (
                <div key={index} className="h-full flex flex-col justify-between p-2 border border-gray-100 rounded-lg bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded border ${disasterColor}`}>
                        {disasterType}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <LuCalendar className="h-3 w-3" />
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    
                    <p className="text-gray-700 text-xs mb-2 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDisasterIcon(article.title, article.description)}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {article.source.name}
                      </span>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read
                      <LuExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Dots indicator */}
      {news.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
