import 'package:flutter/material.dart';
import '../services/cache_service.dart';

class RefreshWrapper extends StatefulWidget {
  final Widget child;
  final Future<void> Function()? onRefresh;
  final bool enablePullToRefresh;
  final bool enableCacheClear;
  final String? refreshMessage;
  final Color? refreshIndicatorColor;
  final Color? backgroundColor;

  const RefreshWrapper({
    super.key,
    required this.child,
    this.onRefresh,
    this.enablePullToRefresh = true,
    this.enableCacheClear = false,
    this.refreshMessage,
    this.refreshIndicatorColor,
    this.backgroundColor,
  });

  @override
  State<RefreshWrapper> createState() => _RefreshWrapperState();
}

class _RefreshWrapperState extends State<RefreshWrapper> {
  final CacheService _cacheService = CacheService();
  bool _isRefreshing = false;

  Future<void> _handleRefresh() async {
    if (_isRefreshing) return;

    setState(() {
      _isRefreshing = true;
    });

    try {
      // Call custom refresh function if provided
      if (widget.onRefresh != null) {
        await widget.onRefresh!();
      }

      // Clear cache if enabled
      if (widget.enableCacheClear) {
        await _cacheService.clearAllCache();
      }

      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(widget.refreshMessage ?? 'App refreshed successfully'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Refresh failed: $e'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
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

  @override
  Widget build(BuildContext context) {
    if (!widget.enablePullToRefresh) {
      return widget.child;
    }

    return RefreshIndicator(
      onRefresh: _handleRefresh,
      color: widget.refreshIndicatorColor ?? Theme.of(context).primaryColor,
      backgroundColor: widget.backgroundColor ?? Colors.white,
      strokeWidth: 2.5,
      displacement: 40,
      child: Stack(
        children: [
          widget.child,
          if (_isRefreshing)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: Container(
                height: 4,
                child: LinearProgressIndicator(
                  backgroundColor: Colors.transparent,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    widget.refreshIndicatorColor ?? Theme.of(context).primaryColor,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Custom refresh indicator with enhanced styling
class CustomRefreshIndicator extends StatelessWidget {
  final Widget child;
  final Future<void> Function()? onRefresh;
  final String? message;
  final Color? color;
  final Color? backgroundColor;

  const CustomRefreshIndicator({
    super.key,
    required this.child,
    this.onRefresh,
    this.message,
    this.color,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh ?? () async {},
      color: color ?? Theme.of(context).primaryColor,
      backgroundColor: backgroundColor ?? Colors.white,
      strokeWidth: 3,
      displacement: 50,
      child: child,
    );
  }
}

/// Pull-to-refresh with cache clear option
class SmartRefreshWrapper extends StatefulWidget {
  final Widget child;
  final Future<void> Function()? onRefresh;
  final bool clearCacheOnRefresh;
  final String? successMessage;
  final String? errorMessage;

  const SmartRefreshWrapper({
    super.key,
    required this.child,
    this.onRefresh,
    this.clearCacheOnRefresh = false,
    this.successMessage,
    this.errorMessage,
  });

  @override
  State<SmartRefreshWrapper> createState() => _SmartRefreshWrapperState();
}

class _SmartRefreshWrapperState extends State<SmartRefreshWrapper> {
  final CacheService _cacheService = CacheService();
  bool _isRefreshing = false;

  Future<void> _handleSmartRefresh() async {
    if (_isRefreshing) return;

    setState(() {
      _isRefreshing = true;
    });

    try {
      // Execute custom refresh logic
      if (widget.onRefresh != null) {
        await widget.onRefresh!();
      }

      // Clear cache if requested
      if (widget.clearCacheOnRefresh) {
        await _cacheService.clearAllCache();
      }

      if (mounted) {
        _showSuccessMessage();
      }
    } catch (e) {
      if (mounted) {
        _showErrorMessage(e.toString());
      }
    } finally {
      if (mounted) {
        setState(() {
          _isRefreshing = false;
        });
      }
    }
  }

  void _showSuccessMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 8),
            Text(widget.successMessage ?? 'Refreshed successfully'),
          ],
        ),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  void _showErrorMessage(String error) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error, color: Colors.white),
            const SizedBox(width: 8),
            Expanded(child: Text(widget.errorMessage ?? 'Refresh failed: $error')),
          ],
        ),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _handleSmartRefresh,
      color: Theme.of(context).primaryColor,
      backgroundColor: Colors.white,
      strokeWidth: 2.5,
      displacement: 40,
      child: widget.child,
    );
  }
}
