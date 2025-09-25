import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/refresh_wrapper.dart';
import '../services/cache_service.dart';

class CommunityPage extends StatefulWidget {
  const CommunityPage({super.key});

  @override
  State<CommunityPage> createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  bool _isRefreshingNews = false;
  final CacheService _cacheService = CacheService();

  final List<Map<String, dynamic>> _newsArticles = [
    {
      'id': 1,
      'title': 'High Tide Warning Issued for Mumbai Coast',
      'description': 'Mumbai Port Trust has issued a high tide warning for the next 48 hours. Residents in low-lying areas are advised to take necessary precautions.',
      'source': 'Times of India',
      'author': 'Rajesh Kumar',
      'publishedAt': '2024-01-15T10:30:00Z',
      'url': 'https://example.com/news1',
      'disasterType': 'High Tide',
    },
    {
      'id': 2,
      'title': 'Cyclone Alert: Strong Winds Expected in Tamil Nadu',
      'description': 'The Indian Meteorological Department has issued a cyclone alert for coastal Tamil Nadu. Fishermen are advised not to venture into the sea.',
      'source': 'The Hindu',
      'author': 'Priya Sharma',
      'publishedAt': '2024-01-15T08:15:00Z',
      'url': 'https://example.com/news2',
      'disasterType': 'Storm',
    },
    {
      'id': 3,
      'title': 'Flooding Reported in Coastal Areas of Kerala',
      'description': 'Heavy rainfall has caused flooding in several coastal districts of Kerala. Relief operations are underway in affected areas.',
      'source': 'Mathrubhumi',
      'author': 'Suresh Nair',
      'publishedAt': '2024-01-15T06:45:00Z',
      'url': 'https://example.com/news3',
      'disasterType': 'Flood',
    },
    {
      'id': 4,
      'title': 'Tsunami Warning System Tested Successfully',
      'description': 'The Indian Tsunami Early Warning Centre successfully tested its warning system along the eastern coast. All monitoring stations are operational.',
      'source': 'Deccan Herald',
      'author': 'Anita Reddy',
      'publishedAt': '2024-01-14T16:20:00Z',
      'url': 'https://example.com/news4',
      'disasterType': 'Tsunami',
    },
  ];

  final List<Map<String, dynamic>> _socialFeeds = [
    {
      'id': 1,
      'platform': 'Twitter',
      'author': '@CoastalWatch_IN',
      'content': 'High tide warning issued for Mumbai coast. Residents advised to avoid low-lying areas. #TsunamiAlert #MumbaiTide',
      'timestamp': '15 mins ago',
      'engagement': 234,
      'sentiment': 'urgent',
      'verified': true,
    },
    {
      'id': 2,
      'platform': 'Instagram',
      'author': '@chennai_fishermen',
      'content': 'Storm clouds gathering over Marina Beach. Fishermen returning to shore immediately. Stay safe everyone! 🌊⚠️',
      'timestamp': '32 mins ago',
      'engagement': 89,
      'sentiment': 'concerned',
      'verified': false,
    },
    {
      'id': 3,
      'platform': 'Facebook',
      'author': 'Goa Tourism Safety',
      'content': 'Current situation at Baga Beach: Strong rip currents detected. Swimming temporarily prohibited. Lifeguards on high alert.',
      'timestamp': '1 hour ago',
      'engagement': 156,
      'sentiment': 'alert',
      'verified': true,
    },
    {
      'id': 4,
      'platform': 'Twitter',
      'author': '@INCOIS_Official',
      'content': 'Sea level monitoring stations report abnormal readings along Andhra Pradesh coast. Advisory issued to coastal districts.',
      'timestamp': '2 hours ago',
      'engagement': 445,
      'sentiment': 'official',
      'verified': true,
    },
  ];

  final List<Map<String, dynamic>> _trendingHashtags = [
    {'tag': '#TsunamiAlert', 'count': 2340, 'change': '+45%'},
    {'tag': '#CoastalSafety', 'count': 1890, 'change': '+32%'},
    {'tag': '#HighTide', 'count': 1567, 'change': '+28%'},
    {'tag': '#StormWarning', 'count': 1234, 'change': '+15%'},
    {'tag': '#OceanSafety', 'count': 987, 'change': '+8%'},
    {'tag': '#DisasterPrep', 'count': 756, 'change': '+12%'},
  ];

  final List<Map<String, dynamic>> _sentimentData = [
    {'category': 'Urgent/Emergency', 'percentage': 35, 'color': Colors.red},
    {'category': 'Concerned/Alert', 'percentage': 28, 'color': Colors.orange},
    {'category': 'Informational', 'percentage': 25, 'color': Colors.blue},
    {'category': 'Positive/Safe', 'percentage': 12, 'color': Colors.green},
  ];


  Color _getSentimentColor(String sentiment) {
    switch (sentiment) {
      case 'urgent':
        return Colors.red;
      case 'concerned':
        return Colors.orange;
      case 'alert':
        return Colors.yellow;
      case 'official':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  IconData _getPlatformIcon(String platform) {
    switch (platform) {
      case 'Twitter':
        return Icons.alternate_email;
      case 'Instagram':
        return Icons.camera_alt;
      case 'Facebook':
        return Icons.facebook;
      default:
        return Icons.people;
    }
  }

  Future<void> _handleRefresh() async {
    // Refresh news and social feeds
    setState(() {
      _isRefreshingNews = true;
    });
    
    // Simulate API call delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Clear cache for fresh data
    await _cacheService.clearImageCache();
    
    setState(() {
      _isRefreshingNews = false;
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Community data refreshed successfully'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFf9fafb),
      child: RefreshWrapper(
        onRefresh: _handleRefresh,
        enableCacheClear: true,
        refreshMessage: 'Community data refreshed and cache cleared',
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
                  // Header Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Social Media Insights',
        style: TextStyle(
          fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1e3a8a),
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'AI-powered analysis of ocean hazard discussions',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Latest India Coastal Disaster News
                  _buildNewsSection(),

                  const SizedBox(height: 16),

                  // Live Social Feed
                  _buildSocialFeed(),

                  const SizedBox(height: 16),

                  // Sentiment Analysis
                  _buildSentimentAnalysis(),

                  const SizedBox(height: 16),

                  // Trending Hashtags
                  _buildTrendingHashtags(),

                  const SizedBox(height: 16),

                  // AI Insights
                  _buildAIInsights(),
                ],
          ),
        ),
      ),
    );
  }

  Widget _buildSocialFeed() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.chat_bubble_outline,
                    color: Color(0xFF3b82f6),
                    size: 16,
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'Live Social Media Feed',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1e3a8a),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _socialFeeds.length,
            itemBuilder: (context, index) {
              final post = _socialFeeds[index];
              return _buildSocialPost(post);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSocialPost(Map<String, dynamic> post) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.grey.shade200),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _getPlatformIcon(post['platform']),
                      size: 12,
                      color: const Color(0xFF3b82f6),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      post['platform'],
                      style: const TextStyle(
                        fontSize: 10,
                        color: Color(0xFF3b82f6),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                post['author'],
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF374151),
                ),
              ),
              if (post['verified'])
                const Padding(
                  padding: EdgeInsets.only(left: 4),
                  child: Icon(
                    Icons.verified,
                    size: 12,
                    color: Colors.blue,
                  ),
                ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: _getSentimentColor(post['sentiment']).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  post['sentiment'],
                  style: TextStyle(
                    fontSize: 10,
                    color: _getSentimentColor(post['sentiment']),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            post['content'],
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFF374151),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(
                Icons.visibility,
                size: 12,
                color: Colors.grey,
              ),
              const SizedBox(width: 4),
              Text(
                '${post['engagement']} engagements',
                style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                ),
              ),
              const Spacer(),
              Text(
                post['timestamp'],
                style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms).slideX(begin: 0.2);
  }

  Widget _buildSentimentAnalysis() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.trending_up,
                  color: Color(0xFF3b82f6),
                  size: 16,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Sentiment Analysis',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1e3a8a),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._sentimentData.map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        item['category'],
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF374151),
                        ),
                      ),
                      Text(
                        '${item['percentage']}%',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF374151),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  LinearProgressIndicator(
                    value: item['percentage'] / 100,
                    backgroundColor: Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(item['color']),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2);
  }

  Widget _buildTrendingHashtags() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),  
                child: const Icon(
                  Icons.tag,
                  color: Color(0xFF3b82f6),
                  size: 16,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Trending Hashtags',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1e3a8a),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._trendingHashtags.map((hashtag) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    hashtag['tag'],
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF3b82f6),
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        '${hashtag['count']}',
                        style: const TextStyle(
                          fontSize: 11,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: hashtag['change'].startsWith('+')
                              ? Colors.green.withValues(alpha: 0.1)
                              : Colors.red.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          hashtag['change'],
                          style: TextStyle(
                            fontSize: 10,
                            color: hashtag['change'].startsWith('+')
                                ? Colors.green
                                : Colors.red,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2);
  }

  Widget _buildAIInsights() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFFf97316).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.psychology,
                  color: Color(0xFFf97316),
                  size: 16,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'AI Insights',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1e3a8a),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInsightCard(
            'Critical Alert Detected',
            'Spike in tsunami-related mentions in Andhra Pradesh region (3x normal)',
            Colors.red,
          ),
          const SizedBox(height: 8),
          _buildInsightCard(
            'Rising Concern',
            'Increased fishermen safety discussions in Tamil Nadu coastal areas',
            Colors.orange,
          ),
          const SizedBox(height: 8),
          _buildInsightCard(
            'Positive Trend',
            'More coastal communities sharing safety awareness content',
            Colors.green,
          ),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2);
  }

  Widget _buildInsightCard(String title, String description, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: TextStyle(
              fontSize: 11,
              color: color.withValues(alpha: 0.8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNewsSection() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.newspaper,
                    color: Color(0xFF3b82f6),
                    size: 18,
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Latest India Coastal Disaster News',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1f2937),
                        ),
                      ),
                      Text(
                        'Recent news about India\'s coastal ocean hazards, storms, floods, and high tides',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: _refreshNews,
                  icon: _isRefreshingNews
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF3b82f6)),
                          ),
                        )
                      : const Icon(
                          Icons.refresh,
                          color: Color(0xFF3b82f6),
                          size: 20,
                        ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              children: _newsArticles.map((article) => _buildNewsArticle(article)).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNewsArticle(Map<String, dynamic> article) {
    final disasterType = article['disasterType'] as String;
    final disasterColor = _getDisasterColor(disasterType);
    final disasterIcon = _getDisasterIcon(disasterType);
    final timeAgo = _formatTimeAgo(article['publishedAt'] as String);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: disasterColor['background'],
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: disasterColor['border']!),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      disasterIcon,
                      size: 12,
                      color: disasterColor['text'],
                    ),
                    const SizedBox(width: 4),
                    Text(
                      disasterType,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: disasterColor['text'],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                timeAgo,
                style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  article['source'] as String,
                  style: const TextStyle(
                    fontSize: 9,
                    color: Colors.grey,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            article['title'] as String,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1f2937),
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          Text(
            article['description'] as String,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF6b7280),
              height: 1.4,
            ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              if (article['author'] != null) ...[
                Text(
                  'By ${article['author']}',
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(width: 12),
              ],
              const Spacer(),
              GestureDetector(
                onTap: () {
                  // Handle read more action
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Opening news article...'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Read More',
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF3b82f6),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.open_in_new,
                      size: 12,
                      color: Color(0xFF3b82f6),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Map<String, Color> _getDisasterColor(String type) {
    switch (type) {
      case 'Tsunami':
        return {
          'background': Colors.red.withValues(alpha: 0.1),
          'text': Colors.red.shade800,
          'border': Colors.red.shade200,
        };
      case 'Storm':
        return {
          'background': Colors.orange.withValues(alpha: 0.1),
          'text': Colors.orange.shade800,
          'border': Colors.orange.shade200,
        };
      case 'Flood':
        return {
          'background': Colors.blue.withValues(alpha: 0.1),
          'text': Colors.blue.shade800,
          'border': Colors.blue.shade200,
        };
      case 'High Tide':
        return {
          'background': Colors.yellow.withValues(alpha: 0.1),
          'text': Colors.yellow.shade800,
          'border': Colors.yellow.shade200,
        };
      default:
        return {
          'background': Colors.grey.withValues(alpha: 0.1),
          'text': Colors.grey.shade800,
          'border': Colors.grey.shade200,
        };
    }
  }

  IconData _getDisasterIcon(String type) {
    switch (type) {
      case 'Tsunami':
        return Icons.waves;
      case 'Storm':
        return Icons.air;
      case 'Flood':
        return Icons.water_drop;
      case 'High Tide':
        return Icons.water;
      default:
        return Icons.warning;
    }
  }

  String _formatTimeAgo(String publishedAt) {
    final now = DateTime.now();
    final published = DateTime.parse(publishedAt);
    final difference = now.difference(published);

    if (difference.inHours < 1) {
      return 'Just now';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  void _refreshNews() {
    setState(() {
      _isRefreshingNews = true;
    });

    // Simulate refresh delay
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _isRefreshingNews = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('News refreshed successfully'),
            duration: Duration(seconds: 2),
          ),
        );
      }
    });
  }
}
