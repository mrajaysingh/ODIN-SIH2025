import 'package:flutter/material.dart';
import '../widgets/refresh_wrapper.dart';
import '../services/cache_service.dart';

/// Demo page showing pull-to-refresh functionality
class RefreshDemoPage extends StatefulWidget {
  const RefreshDemoPage({super.key});

  @override
  State<RefreshDemoPage> createState() => _RefreshDemoPageState();
}

class _RefreshDemoPageState extends State<RefreshDemoPage> {
  final List<String> _items = [];
  final CacheService _cacheService = CacheService();
  bool _isLoading = false;
  String _lastRefresh = 'Never';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    setState(() {
      _items.clear();
      _items.addAll([
        '🌊 Tsunami Alert - Mumbai Coast',
        '⛈️ Storm Warning - Tamil Nadu',
        '🌧️ Flood Alert - Kerala',
        '🌊 High Tide - Goa',
        '🚨 Emergency - Chennai',
        '⚠️ Warning - Visakhapatnam',
        '📢 Advisory - Mangalore',
        '🔔 Update - Kochi',
      ]);
      _isLoading = false;
    });
  }

  Future<void> _handleRefresh() async {
    // This function will be called when user pulls to refresh
    await _loadData();
    
    // Clear cache for fresh data
    await _cacheService.clearImageCache();
    
    setState(() {
      _lastRefresh = DateTime.now().toString().substring(11, 19);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pull to Refresh Demo'),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: _handleRefresh,
            icon: const Icon(Icons.refresh),
            tooltip: 'Manual Refresh',
          ),
        ],
      ),
      body: RefreshWrapper(
        onRefresh: _handleRefresh,
        enableCacheClear: true,
        refreshMessage: 'Data refreshed and cache cleared',
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  // Header with last refresh time
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    color: Colors.blue[50],
                    child: Column(
                      children: [
                        const Icon(
                          Icons.swipe_down,
                          size: 32,
                          color: Colors.blue,
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Pull down to refresh',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Last refreshed: $_lastRefresh',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // List of items
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _items.length,
                      itemBuilder: (context, index) {
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.blue[100],
                              child: Text('${index + 1}'),
                            ),
                            title: Text(_items[index]),
                            subtitle: Text('Updated: ${DateTime.now().toString().substring(11, 19)}'),
                            trailing: const Icon(Icons.arrow_forward_ios),
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Tapped on ${_items[index]}'),
                                  duration: const Duration(seconds: 1),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
