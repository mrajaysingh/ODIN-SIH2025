import 'package:flutter/material.dart';
import '../widgets/refresh_wrapper.dart';
import '../services/cache_service.dart';

/// Example page showing how to integrate pull-to-refresh functionality
class ExampleRefreshPage extends StatefulWidget {
  const ExampleRefreshPage({super.key});

  @override
  State<ExampleRefreshPage> createState() => _ExampleRefreshPageState();
}

class _ExampleRefreshPageState extends State<ExampleRefreshPage> {
  final List<String> _items = [];
  final CacheService _cacheService = CacheService();
  bool _isLoading = false;

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
        'Disaster Alert 1',
        'Weather Update 2',
        'Emergency Contact 3',
        'Safety Guidelines 4',
        'Evacuation Route 5',
      ]);
      _isLoading = false;
    });
  }

  Future<void> _handleRefresh() async {
    // This function will be called when user pulls to refresh
    await _loadData();
    
    // Optionally clear cache
    await _cacheService.clearImageCache();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pull to Refresh Example'),
        backgroundColor: Colors.blue[600],
        foregroundColor: Colors.white,
      ),
      body: RefreshWrapper(
        onRefresh: _handleRefresh,
        enableCacheClear: true,
        refreshMessage: 'Data refreshed and cache cleared',
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
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
                      subtitle: Text('Last updated: ${DateTime.now().toString().substring(11, 19)}'),
                      trailing: const Icon(Icons.arrow_forward_ios),
                    ),
                  );
                },
              ),
      ),
    );
  }
}

/// Example of using SmartRefreshWrapper with automatic cache clearing
class SmartRefreshExamplePage extends StatefulWidget {
  const SmartRefreshExamplePage({super.key});

  @override
  State<SmartRefreshExamplePage> createState() => _SmartRefreshExamplePageState();
}

class _SmartRefreshExamplePageState extends State<SmartRefreshExamplePage> {
  String _lastUpdate = 'Never';

  Future<void> _handleSmartRefresh() async {
    // Simulate data refresh
    await Future.delayed(const Duration(seconds: 2));
    
    setState(() {
      _lastUpdate = DateTime.now().toString().substring(11, 19);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Refresh Example'),
        backgroundColor: Colors.green[600],
        foregroundColor: Colors.white,
      ),
      body: SmartRefreshWrapper(
        onRefresh: _handleSmartRefresh,
        clearCacheOnRefresh: true,
        successMessage: 'App refreshed and cache cleared!',
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.refresh,
                size: 64,
                color: Colors.green[600],
              ),
              const SizedBox(height: 16),
              Text(
                'Pull down to refresh',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Last updated: $_lastUpdate',
                style: TextStyle(color: Colors.grey[600]),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ExampleRefreshPage(),
                    ),
                  );
                },
                icon: const Icon(Icons.list),
                label: const Text('View List Example'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[600],
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
