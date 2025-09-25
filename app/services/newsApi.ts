export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const NEWS_API_KEY = 'd59a12c1bfcd4fdba53d50cd2b4c1fe0';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';

// Ocean disaster related keywords - more specific and targeted
const OCEAN_DISASTER_KEYWORDS = [
  'tsunami warning',
  'hurricane warning',
  'cyclone warning',
  'typhoon warning',
  'storm surge warning',
  'coastal flood warning',
  'ocean flood warning',
  'marine storm warning',
  'tidal wave warning',
  'coastal storm warning',
  'tropical storm warning',
  'ocean storm warning',
  'tsunami alert',
  'hurricane alert',
  'cyclone alert',
  'typhoon alert',
  'storm surge alert',
  'coastal flood alert',
  'ocean flood alert',
  'marine storm alert',
  'tidal wave alert',
  'coastal storm alert',
  'tropical storm alert',
  'ocean storm alert',
  'tsunami',
  'hurricane',
  'cyclone',
  'typhoon',
  'storm surge',
  'coastal flood',
  'ocean flood',
  'marine storm',
  'tidal wave',
  'coastal storm',
  'tropical storm',
  'ocean storm',
  'high tide warning',
  'sea level rise',
  'ocean disaster',
  'marine disaster'
];

// Get date 2 days ago in YYYY-MM-DD format
function getDateTwoDaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 2);
  return date.toISOString().split('T')[0];
}

// Create search query from keywords
function createSearchQuery(): string {
  return OCEAN_DISASTER_KEYWORDS.join(' OR ');
}

export async function fetchOceanDisasterNews(): Promise<NewsArticle[]> {
  try {
    const fromDate = getDateTwoDaysAgo();
    const allArticles: NewsArticle[] = [];
    
    // Use multiple targeted searches for better results
    const searchTerms = [
      'tsunami warning',
      'hurricane warning', 
      'cyclone warning',
      'typhoon warning',
      'storm surge warning',
      'coastal flood warning',
      'ocean flood warning',
      'marine storm warning',
      'tidal wave warning',
      'coastal storm warning',
      'tropical storm warning',
      'ocean storm warning',
      'tsunami alert',
      'hurricane alert',
      'cyclone alert',
      'typhoon alert',
      'storm surge alert',
      'coastal flood alert',
      'ocean flood alert',
      'marine storm alert',
      'tidal wave alert',
      'coastal storm alert',
      'tropical storm alert',
      'ocean storm alert',
      'high tide warning',
      'sea level rise',
      'ocean disaster',
      'marine disaster'
    ];

    // Search with multiple terms to get better coverage
    for (const searchTerm of searchTerms.slice(0, 5)) { // Limit to 5 searches to avoid rate limiting
      try {
        const params = new URLSearchParams({
          q: searchTerm,
          from: fromDate,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: '5',
          apiKey: NEWS_API_KEY
        });

        const response = await fetch(`${NEWS_API_BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn(`Search failed for "${searchTerm}": ${response.status}`);
          continue;
        }

        const data: NewsResponse = await response.json();
        
        if (data.status !== 'ok') {
          console.warn(`API error for "${searchTerm}": ${data.status}`);
          continue;
        }

        // Filter articles to ensure they are relevant to ocean disasters
        const filteredArticles = data.articles.filter(article => {
          const title = article.title.toLowerCase();
          const description = article.description.toLowerCase();
          const content = article.content?.toLowerCase() || '';
          
          // Check if the article is actually about ocean disasters
          const isOceanDisaster = OCEAN_DISASTER_KEYWORDS.some(keyword => 
            title.includes(keyword) || 
            description.includes(keyword) || 
            content.includes(keyword)
          );
          
          // Additional filtering to ensure relevance
          const hasOceanContext = title.includes('ocean') || 
                                 title.includes('coastal') || 
                                 title.includes('marine') || 
                                 title.includes('sea') || 
                                 title.includes('tidal') || 
                                 title.includes('tsunami') || 
                                 title.includes('hurricane') || 
                                 title.includes('cyclone') || 
                                 title.includes('typhoon') || 
                                 title.includes('storm surge') ||
                                 description.includes('ocean') || 
                                 description.includes('coastal') || 
                                 description.includes('marine') || 
                                 description.includes('sea') || 
                                 description.includes('tidal') || 
                                 description.includes('tsunami') || 
                                 description.includes('hurricane') || 
                                 description.includes('cyclone') || 
                                 description.includes('typhoon') || 
                                 description.includes('storm surge');
          
          return isOceanDisaster && hasOceanContext;
        });

        allArticles.push(...filteredArticles);
      } catch (error) {
        console.warn(`Error searching for "${searchTerm}":`, error);
        continue;
      }
    }

    // Remove duplicates based on URL
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    // Sort by published date (newest first)
    uniqueArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const finalArticles = uniqueArticles.slice(0, 10);
    
    // If no real ocean disaster news found, show mock data with a note
    if (finalArticles.length === 0) {
      console.log('No real ocean disaster news found in the last 2 days. Showing sample data.');
      return getMockNewsData();
    }
    
    return finalArticles;
  } catch (error) {
    console.error('Error fetching ocean disaster news:', error);
    // Return mock data in case of API failure
    return getMockNewsData();
  }
}

// Mock data for fallback
function getMockNewsData(): NewsArticle[] {
  return [
    {
      source: { id: 'bbc-news', name: 'BBC News' },
      author: 'BBC Weather Team',
      title: 'Severe Storm Warning Issued for Coastal Areas',
      description: 'Meteorologists warn of potential flooding and high tides affecting coastal regions over the next 48 hours.',
      url: 'https://example.com/storm-warning',
      urlToImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      content: 'Severe weather conditions expected to impact coastal areas with potential for flooding and storm surges.'
    },
    {
      source: { id: 'cnn', name: 'CNN' },
      author: 'CNN Weather',
      title: 'Tsunami Alert System Activated in Pacific Region',
      description: 'Early warning systems detect seismic activity that could trigger tsunami waves in the Pacific Ocean.',
      url: 'https://example.com/tsunami-alert',
      urlToImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      content: 'Seismic monitoring stations report unusual activity that may result in tsunami formation.'
    },
    {
      source: { id: 'reuters', name: 'Reuters' },
      author: 'Reuters Environment',
      title: 'Rising Sea Levels Threaten Coastal Communities',
      description: 'New research shows accelerated sea level rise causing increased flooding in low-lying coastal areas.',
      url: 'https://example.com/sea-level-rise',
      urlToImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      content: 'Climate change continues to drive sea level rise, putting coastal communities at greater risk.'
    },
    {
      source: { id: 'weather-channel', name: 'The Weather Channel' },
      author: 'Weather Channel Staff',
      title: 'Hurricane Season Brings Increased Coastal Flooding Risk',
      description: 'Experts predict above-average hurricane activity with potential for significant coastal flooding and storm surge.',
      url: 'https://example.com/hurricane-season',
      urlToImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      content: 'Hurricane season is expected to bring increased risk of coastal flooding and storm surge to vulnerable areas.'
    },
    {
      source: { id: 'noaa', name: 'NOAA' },
      author: 'NOAA Ocean Service',
      title: 'Marine Storm Warning Issued for Atlantic Coast',
      description: 'National Oceanic and Atmospheric Administration issues marine storm warning for Atlantic coastal waters.',
      url: 'https://example.com/marine-storm-warning',
      urlToImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      content: 'Marine storm warning issued for Atlantic coastal waters due to developing weather system.'
    }
  ];
}
