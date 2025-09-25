import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';

class CacheService {
  static final CacheService _instance = CacheService._internal();
  factory CacheService() => _instance;
  CacheService._internal();

  /// Clear all app cache including:
  /// - Image cache
  /// - Network cache
  /// - Shared preferences (optional)
  /// - Temporary files
  Future<void> clearAllCache({bool clearPreferences = false}) async {
    try {
      // Clear image cache
      await DefaultCacheManager().emptyCache();
      
      // Clear temporary directory
      final tempDir = await getTemporaryDirectory();
      if (await tempDir.exists()) {
        await tempDir.delete(recursive: true);
      }
      
      // Clear application documents cache
      final appDocDir = await getApplicationDocumentsDirectory();
      final cacheDir = Directory('${appDocDir.path}/cache');
      if (await cacheDir.exists()) {
        await cacheDir.delete(recursive: true);
      }
      
      // Clear SharedPreferences if requested
      if (clearPreferences) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.clear();
      }
      
      print('Cache cleared successfully');
    } catch (e) {
      print('Error clearing cache: $e');
      rethrow;
    }
  }

  /// Clear only image cache
  Future<void> clearImageCache() async {
    try {
      await DefaultCacheManager().emptyCache();
      print('Image cache cleared');
    } catch (e) {
      print('Error clearing image cache: $e');
      rethrow;
    }
  }

  /// Clear only network cache
  Future<void> clearNetworkCache() async {
    try {
      final tempDir = await getTemporaryDirectory();
      if (await tempDir.exists()) {
        await tempDir.delete(recursive: true);
      }
      print('Network cache cleared');
    } catch (e) {
      print('Error clearing network cache: $e');
      rethrow;
    }
  }

  /// Get cache size in bytes
  Future<int> getCacheSize() async {
    try {
      int totalSize = 0;
      
      // Get temp directory size
      final tempDir = await getTemporaryDirectory();
      if (await tempDir.exists()) {
        totalSize += await _getDirectorySize(tempDir);
      }
      
      // Get app documents cache size
      final appDocDir = await getApplicationDocumentsDirectory();
      final cacheDir = Directory('${appDocDir.path}/cache');
      if (await cacheDir.exists()) {
        totalSize += await _getDirectorySize(cacheDir);
      }
      
      return totalSize;
    } catch (e) {
      print('Error getting cache size: $e');
      return 0;
    }
  }

  /// Format cache size to human readable format
  String formatCacheSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }

  /// Helper method to calculate directory size
  Future<int> _getDirectorySize(Directory directory) async {
    int size = 0;
    try {
      await for (final entity in directory.list(recursive: true)) {
        if (entity is File) {
          size += await entity.length();
        }
      }
    } catch (e) {
      print('Error calculating directory size: $e');
    }
    return size;
  }
}
