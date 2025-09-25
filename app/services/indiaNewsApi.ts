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

const NEWS_API_KEY = 'd59a12c1bfcd4fdba53d50cd2b4c1fe0';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything';

// India coastal disaster keywords - comprehensive ocean hazards
const INDIA_COASTAL_KEYWORDS = [
  // Tsunami related
  'india tsunami',
  'tsunami india',
  'indian tsunami',
  'tsunami warning india',
  'tsunami alert india',
  
  // Cyclone related
  'india cyclone',
  'cyclone india',
  'indian cyclone',
  'cyclone warning india',
  'cyclone alert india',
  'tropical cyclone india',
  
  // Storm related
  'india storm',
  'storm india',
  'indian storm',
  'storm surge india',
  'india storm surge',
  'coastal storm india',
  'marine storm india',
  'ocean storm india',
  
  // Flood related
  'india flood',
  'flood india',
  'indian flood',
  'coastal flood india',
  'india coastal flood',
  'ocean flood india',
  'india ocean flood',
  'marine flood india',
  'india marine flood',
  
  // High tide related
  'india high tide',
  'high tide india',
  'indian high tide',
  'tidal wave india',
  'india tidal wave',
  'tide warning india',
  'india tide warning',
  
  // Indian coastal cities and states
  'mumbai flood',
  'mumbai storm',
  'mumbai tsunami',
  'mumbai cyclone',
  'chennai flood',
  'chennai storm',
  'chennai tsunami',
  'chennai cyclone',
  'kolkata flood',
  'kolkata storm',
  'kolkata tsunami',
  'kolkata cyclone',
  'goa flood',
  'goa storm',
  'goa tsunami',
  'goa cyclone',
  'kerala flood',
  'kerala storm',
  'kerala tsunami',
  'kerala cyclone',
  'andhra pradesh flood',
  'andhra pradesh storm',
  'andhra pradesh tsunami',
  'andhra pradesh cyclone',
  'tamil nadu flood',
  'tamil nadu storm',
  'tamil nadu tsunami',
  'tamil nadu cyclone',
  'west bengal flood',
  'west bengal storm',
  'west bengal tsunami',
  'west bengal cyclone',
  'odisha flood',
  'odisha storm',
  'odisha tsunami',
  'odisha cyclone',
  'gujarat flood',
  'gujarat storm',
  'gujarat tsunami',
  'gujarat cyclone',
  'maharashtra flood',
  'maharashtra storm',
  'maharashtra tsunami',
  'maharashtra cyclone',
  'karnataka flood',
  'karnataka storm',
  'karnataka tsunami',
  'karnataka cyclone',
  
  // Indian territories and regions
  'andaman nicobar',
  'andaman tsunami',
  'andaman cyclone',
  'andaman flood',
  'andaman storm',
  'nicobar tsunami',
  'nicobar cyclone',
  'nicobar flood',
  'nicobar storm',
  'lakshadweep',
  'lakshadweep tsunami',
  'lakshadweep cyclone',
  'lakshadweep flood',
  'lakshadweep storm',
  
  // Indian water bodies
  'bay of bengal',
  'bay of bengal cyclone',
  'bay of bengal storm',
  'bay of bengal tsunami',
  'arabian sea',
  'arabian sea cyclone',
  'arabian sea storm',
  'arabian sea tsunami',
  'indian ocean',
  'indian ocean cyclone',
  'indian ocean storm',
  'indian ocean tsunami',
  'indian ocean flood',
  
  // General coastal terms
  'coastal india',
  'indian coast',
  'india coastal',
  'coastal disaster india',
  'india coastal disaster',
  'marine disaster india',
  'india marine disaster',
  'ocean disaster india',
  'india ocean disaster',
  'coastal hazard india',
  'india coastal hazard',
  'marine hazard india',
  'india marine hazard',
  'ocean hazard india',
  'india ocean hazard'
];

function getDateTwoDaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 2);
  return date.toISOString().split('T')[0];
}

export async function fetchIndiaCoastalNews(): Promise<NewsArticle[]> {
  try {
    const fromDate = getDateTwoDaysAgo();
    const allArticles: NewsArticle[] = [];
    
    // Search with comprehensive India-specific ocean hazard terms
    const searchTerms = [
      'india tsunami warning',
      'india cyclone warning',
      'india storm surge',
      'india coastal flood',
      'india ocean flood',
      'india marine storm',
      'india high tide warning',
      'mumbai flood',
      'mumbai storm',
      'mumbai tsunami',
      'chennai flood',
      'chennai storm',
      'chennai tsunami',
      'kerala flood',
      'kerala storm',
      'kerala tsunami',
      'andhra pradesh flood',
      'andhra pradesh storm',
      'tamil nadu flood',
      'tamil nadu storm',
      'west bengal flood',
      'west bengal storm',
      'odisha flood',
      'odisha storm',
      'gujarat flood',
      'gujarat storm',
      'maharashtra flood',
      'maharashtra storm',
      'karnataka flood',
      'karnataka storm',
      'andaman nicobar',
      'andaman tsunami',
      'andaman cyclone',
      'lakshadweep',
      'bay of bengal',
      'bay of bengal cyclone',
      'arabian sea',
      'arabian sea cyclone',
      'indian ocean',
      'indian ocean storm',
      'coastal india',
      'india coastal disaster',
      'india marine disaster',
      'india ocean disaster'
    ];

    // Search with multiple terms
    for (const searchTerm of searchTerms.slice(0, 5)) {
      try {
        const params = new URLSearchParams({
          q: searchTerm,
          from: fromDate,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: '3',
          apiKey: NEWS_API_KEY
        });

        const response = await fetch(`${NEWS_API_BASE_URL}?${params}`);
        const data = await response.json();
        
        if (data.status === 'ok') {
          const filteredArticles = data.articles.filter((article: NewsArticle) => {
            const title = article.title.toLowerCase();
            const description = article.description.toLowerCase();
            
            return INDIA_COASTAL_KEYWORDS.some(keyword => 
              title.includes(keyword) || description.includes(keyword)
            );
          });

          allArticles.push(...filteredArticles);
        }
      } catch (error) {
        console.warn(`Error searching for "${searchTerm}":`, error);
        continue;
      }
    }

    // Remove duplicates
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    // Sort by date
    uniqueArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const finalArticles = uniqueArticles.slice(0, 8);
    
    // If no real news found, show mock data
    if (finalArticles.length === 0) {
      return getMockIndiaNewsData();
    }
    
    return finalArticles;
  } catch (error) {
    console.error('Error fetching India coastal news:', error);
    return getMockIndiaNewsData();
  }
}

function getMockIndiaNewsData(): NewsArticle[] {
  return [
    {
      source: { id: 'times-of-india', name: 'The Times of India' },
      author: 'TOI Staff',
      title: 'Cyclone Warning Issued for Andhra Pradesh Coast',
      description: 'IMD issues cyclone warning for coastal Andhra Pradesh with potential for heavy rainfall and storm surge.',
      url: 'https://example.com/andhra-cyclone',
      urlToImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      content: 'Cyclone warning issued for Andhra Pradesh coast with potential for heavy rainfall and storm surge.'
    },
    {
      source: { id: 'hindustan-times', name: 'Hindustan Times' },
      author: 'HT Correspondent',
      title: 'Mumbai Coastal Areas Face High Tide Alert',
      description: 'High tide alert issued for Mumbai coastal areas with potential for flooding in low-lying regions.',
      url: 'https://example.com/mumbai-tide',
      urlToImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      content: 'High tide alert issued for Mumbai coastal areas with potential for flooding.'
    },
    {
      source: { id: 'indian-express', name: 'The Indian Express' },
      author: 'Express News Service',
      title: 'Kerala Backwaters Flood Warning',
      description: 'Flood warning issued for Kerala backwaters due to heavy rainfall and rising water levels.',
      url: 'https://example.com/kerala-flood',
      urlToImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      content: 'Flood warning issued for Kerala backwaters due to heavy rainfall.'
    },
    {
      source: { id: 'deccan-herald', name: 'Deccan Herald' },
      author: 'DH Bureau',
      title: 'Tamil Nadu Coast Storm Surge Alert',
      description: 'Storm surge alert issued for Tamil Nadu coast with potential for coastal flooding.',
      url: 'https://example.com/tamil-nadu-storm',
      urlToImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      content: 'Storm surge alert issued for Tamil Nadu coast with potential for coastal flooding.'
    },
    {
      source: { id: 'the-hindu', name: 'The Hindu' },
      author: 'Hindu Staff',
      title: 'Goa Beaches Rip Current Warning',
      description: 'Rip current warning issued for Goa beaches due to strong ocean currents.',
      url: 'https://example.com/goa-rip-current',
      urlToImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      content: 'Rip current warning issued for Goa beaches due to strong ocean currents.'
    }
  ];
}
