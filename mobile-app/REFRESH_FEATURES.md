# Pull-to-Refresh and Cache Management Features

This document explains how to use the pull-to-refresh and cache clearing features added to your ODIN mobile app.

## Features Added

### 1. Pull-to-Refresh Functionality
- Pull down on any screen to refresh the app
- Automatic cache clearing option
- Custom refresh indicators
- Success/error feedback

### 2. Cache Management
- Clear all app cache
- Clear image cache only
- Clear network cache only
- View cache size
- Automatic cache clearing on refresh

## Files Added

1. `lib/services/cache_service.dart` - Cache management service
2. `lib/widgets/refresh_wrapper.dart` - Refresh wrapper widgets
3. `lib/pages/settings_page.dart` - Settings page with cache management
4. `lib/pages/example_refresh_page.dart` - Example implementations
5. `lib/utils/refresh_utils.dart` - Utility functions and mixins

## Dependencies Added

```yaml
shared_preferences: ^2.2.2
flutter_cache_manager: ^3.3.1
path_provider: ^2.1.2
```

## How to Use

### Method 1: Using RefreshWrapper (Recommended)

```dart
import '../widgets/refresh_wrapper.dart';

class YourPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RefreshWrapper(
        onRefresh: () async {
          // Your refresh logic here
          await loadData();
        },
        enableCacheClear: true, // Optional: clear cache on refresh
        refreshMessage: 'Data refreshed successfully',
        child: YourContentWidget(),
      ),
    );
  }
}
```

### Method 2: Using SmartRefreshWrapper

```dart
import '../widgets/refresh_wrapper.dart';

class YourPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SmartRefreshWrapper(
        onRefresh: () async {
          // Your refresh logic here
          await loadData();
        },
        clearCacheOnRefresh: true, // Automatically clear cache
        successMessage: 'App refreshed and cache cleared!',
        child: YourContentWidget(),
      ),
    );
  }
}
```

### Method 3: Using RefreshMixin

```dart
import '../utils/refresh_utils.dart';

class YourPage extends StatefulWidget {
  @override
  _YourPageState createState() => _YourPageState();
}

class _YourPageState extends State<YourPage> with RefreshMixin {
  @override
  Future<void> onRefresh() async {
    // Your refresh logic here
    await loadData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: buildWithRefresh(
        YourContentWidget(),
      ),
    );
  }
}
```

### Method 4: Manual Cache Management

```dart
import '../services/cache_service.dart';

class YourPage extends StatefulWidget {
  @override
  _YourPageState createState() => _YourPageState();
}

class _YourPageState extends State<YourPage> {
  final CacheService _cacheService = CacheService();

  Future<void> _clearCache() async {
    try {
      await _cacheService.clearAllCache();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cache cleared successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to clear cache: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            onPressed: _clearCache,
            icon: Icon(Icons.delete_sweep),
            tooltip: 'Clear Cache',
          ),
        ],
      ),
      body: YourContentWidget(),
    );
  }
}
```

## Integration Examples

### Adding to Existing Pages

To add pull-to-refresh to your existing pages, simply wrap your content with `RefreshWrapper`:

```dart
// Before
body: ListView.builder(...)

// After
body: RefreshWrapper(
  onRefresh: () async {
    // Your refresh logic
    setState(() {
      // Update your data
    });
  },
  child: ListView.builder(...),
)
```

### Adding Cache Clear Button to AppBar

```dart
AppBar(
  title: Text('Your Page'),
  actions: [
    RefreshUtils.createCacheClearButton(context),
    RefreshUtils.createRefreshButton(
      onPressed: () async {
        // Your refresh logic
      },
    ),
  ],
)
```

## Settings Page

A dedicated settings page has been created at `lib/pages/settings_page.dart` that includes:
- Cache size display
- Clear all cache button
- Clear image cache button
- Clear network cache button
- Pull-to-refresh functionality

To navigate to the settings page:

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => SettingsPage(),
  ),
);
```

## Customization

### Custom Refresh Indicator Colors

```dart
RefreshWrapper(
  refreshIndicatorColor: Colors.blue,
  backgroundColor: Colors.white,
  child: YourContent(),
)
```

### Custom Messages

```dart
RefreshWrapper(
  refreshMessage: 'Your custom success message',
  child: YourContent(),
)
```

## Best Practices

1. **Use RefreshWrapper for simple cases** - Most pages should use RefreshWrapper
2. **Use SmartRefreshWrapper for cache-heavy apps** - When you want automatic cache clearing
3. **Use RefreshMixin for complex pages** - When you need more control over refresh logic
4. **Always handle errors** - Wrap refresh logic in try-catch blocks
5. **Show loading states** - Use the `isRefreshing` state to show loading indicators
6. **Provide user feedback** - Use SnackBars to show success/error messages

## Testing

To test the features:

1. **Pull-to-refresh**: Pull down on any page with RefreshWrapper
2. **Cache clearing**: Use the settings page or cache clear buttons
3. **Error handling**: Test with network disconnected
4. **Performance**: Check cache size before and after clearing

## Troubleshooting

### Common Issues

1. **Dependencies not found**: Run `flutter pub get` to install new dependencies
2. **Cache not clearing**: Check if the app has proper permissions
3. **Refresh not working**: Ensure the child widget is scrollable
4. **Performance issues**: Use `enableCacheClear: false` for heavy operations

### Debug Information

The cache service includes debug logging. Check the console for:
- Cache size information
- Clear operation results
- Error messages

## Future Enhancements

Potential future improvements:
- Selective cache clearing (by type)
- Cache size limits
- Background cache clearing
- Cache warming strategies
- Offline data management
