import 'package:flutter/material.dart';
import '../widgets/refresh_wrapper.dart';
import '../services/cache_service.dart';

/// Utility class for easy integration of refresh functionality
class RefreshUtils {
  static final CacheService _cacheService = CacheService();

  /// Wrap any widget with pull-to-refresh functionality
  static Widget wrapWithRefresh({
    required Widget child,
    Future<void> Function()? onRefresh,
    bool enableCacheClear = false,
    String? refreshMessage,
    Color? refreshIndicatorColor,
    Color? backgroundColor,
  }) {
    return RefreshWrapper(
      onRefresh: onRefresh,
      enableCacheClear: enableCacheClear,
      refreshMessage: refreshMessage,
      refreshIndicatorColor: refreshIndicatorColor,
      backgroundColor: backgroundColor,
      child: child,
    );
  }

  /// Wrap with smart refresh (includes cache clearing)
  static Widget wrapWithSmartRefresh({
    required Widget child,
    Future<void> Function()? onRefresh,
    bool clearCacheOnRefresh = true,
    String? successMessage,
    String? errorMessage,
  }) {
    return SmartRefreshWrapper(
      onRefresh: onRefresh,
      clearCacheOnRefresh: clearCacheOnRefresh,
      successMessage: successMessage,
      errorMessage: errorMessage,
      child: child,
    );
  }

  /// Show cache clear confirmation dialog
  static Future<bool?> showCacheClearDialog(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Clear Cache'),
          content: const Text(
            'This will clear all cached data including images and temporary files. This action cannot be undone.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Clear'),
            ),
          ],
        );
      },
    );
  }

  /// Clear cache with confirmation
  static Future<void> clearCacheWithConfirmation(BuildContext context) async {
    final confirmed = await showCacheClearDialog(context);
    if (confirmed == true) {
      try {
        await _cacheService.clearAllCache();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Cache cleared successfully'),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to clear cache: $e'),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      }
    }
  }

  /// Get formatted cache size
  static Future<String> getFormattedCacheSize() async {
    final size = await _cacheService.getCacheSize();
    return _cacheService.formatCacheSize(size);
  }

  /// Create a refresh button widget
  static Widget createRefreshButton({
    required VoidCallback onPressed,
    String? tooltip,
    Color? color,
  }) {
    return IconButton(
      onPressed: onPressed,
      icon: const Icon(Icons.refresh),
      tooltip: tooltip ?? 'Refresh',
      color: color,
    );
  }

  /// Create a cache clear button widget
  static Widget createCacheClearButton({
    required BuildContext context,
    String? tooltip,
    Color? color,
  }) {
    return IconButton(
      onPressed: () => clearCacheWithConfirmation(context),
      icon: const Icon(Icons.delete_sweep),
      tooltip: tooltip ?? 'Clear Cache',
      color: color,
    );
  }
}

/// Mixin for pages that need refresh functionality
mixin RefreshMixin<T extends StatefulWidget> on State<T> {
  bool _isRefreshing = false;
  final CacheService _cacheService = CacheService();

  bool get isRefreshing => _isRefreshing;

  /// Override this method to implement custom refresh logic
  Future<void> onRefresh() async {
    // Default implementation - override in your page
  }

  /// Call this method to trigger refresh
  Future<void> triggerRefresh() async {
    if (_isRefreshing) return;

    setState(() {
      _isRefreshing = true;
    });

    try {
      await onRefresh();
    } finally {
      if (mounted) {
        setState(() {
          _isRefreshing = false;
        });
      }
    }
  }

  /// Clear cache and refresh
  Future<void> clearCacheAndRefresh() async {
    if (_isRefreshing) return;

    setState(() {
      _isRefreshing = true;
    });

    try {
      await _cacheService.clearAllCache();
      await onRefresh();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Cache cleared and data refreshed'),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Refresh failed: $e'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isRefreshing = false;
        });
      }
    }
  }

  /// Wrap the page content with refresh functionality
  Widget buildWithRefresh(Widget child) {
    return RefreshWrapper(
      onRefresh: clearCacheAndRefresh,
      enableCacheClear: true,
      refreshMessage: 'Page refreshed and cache cleared',
      child: child,
    );
  }
}
