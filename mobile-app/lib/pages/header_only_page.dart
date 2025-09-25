import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:to_do_app/components/global_header.dart';
import 'package:to_do_app/pages/about_odin_page.dart';
import 'package:to_do_app/pages/community_page.dart';
import 'package:to_do_app/pages/live_alerts_page.dart';
import 'package:to_do_app/pages/report_hazard_page.dart';
import 'package:to_do_app/pages/login_page.dart';
import 'package:to_do_app/pages/hotspot_management_page.dart';
import 'package:to_do_app/widgets/odin_map_widget.dart';
import 'package:to_do_app/widgets/refresh_wrapper.dart';
import 'package:to_do_app/services/cache_service.dart';

class HeaderOnlyPage extends StatefulWidget {
  const HeaderOnlyPage({super.key});

  @override
  State<HeaderOnlyPage> createState() => _HeaderOnlyPageState();
}

class _HeaderOnlyPageState extends State<HeaderOnlyPage> {
  String _currentPage = 'Home';
  final CacheService _cacheService = CacheService();

  void _onPageChanged(String page) {
    setState(() {
      _currentPage = page;
    });
  }

  Future<void> _handleRefresh() async {
    // Refresh the current page data
    setState(() {
      // Trigger a rebuild to refresh content
    });
    
    // Clear cache for better performance
    await _cacheService.clearImageCache();
    
    // Show success message
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('App refreshed successfully'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget centerContent;
    switch (_currentPage) {
      case 'Report Hazard':
        centerContent = const ReportHazardPage();
        break;
      case 'Live Alerts':
        centerContent = const LiveAlertsPage();
        break;
      case 'Community':
        centerContent = const CommunityPage();
        break;
      case 'About O.D.I.N.':
        centerContent = const AboutOdinPage();
        break;
      case 'Hotspot Management':
        centerContent = const HotspotManagementPage();
        break;
      case 'Login':
        centerContent = const LoginPage();
        break;
      default:
        centerContent = Container(
          color: Colors.transparent,
          child: const SizedBox.shrink(),
        );
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldExit = await showDialog<bool>(
          context: context,
          barrierDismissible: true,
          builder: (ctx) {
            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              insetPadding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 42,
                          height: 42,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.exit_to_app_rounded, color: Color(0xFFF59E0B)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('Exit O.D.I.N.?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: Color(0xFF111827))),
                              SizedBox(height: 4),
                              Text('Are you sure you want to close the app?', style: TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.of(ctx).pop(false),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFF1e3a8a)),
                              foregroundColor: const Color(0xFF1e3a8a),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.w600)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => Navigator.of(ctx).pop(true),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF59E0B),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Text('Exit', style: TextStyle(fontWeight: FontWeight.w700)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
        if (shouldExit == true) {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Map background - positioned behind headers but not above alert bar
          if (_currentPage != 'Login' && _currentPage != 'Community')
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              bottom: 80, // Leave 80px space at bottom
              child: Padding(
                padding: const EdgeInsets.only(top: 40), // Start after alert bar
                child: const OdinMapWidget(),
              ),
            ),
          
          if (_currentPage == 'Login')
            Positioned.fill(
              child: Image.asset(
                'assets/flood-rescur-login-bg.jpg',
                fit: BoxFit.cover,
              ),
            ),
          
          if (_currentPage == 'Report Hazard')
            Positioned.fill(
              child: Container(
                color: const Color(0xFFF59E0B),
              ),
            ),
          
          SafeArea(
            child: Column(
              children: [
                GlobalHeader(
                  currentPage: _currentPage,
                  onPageChanged: _onPageChanged,
                  onLoginPressed: () => _onPageChanged('Login'),
                  onLanguageChanged: () {},
                ),
                Expanded(
                  child: RefreshWrapper(
                    onRefresh: _handleRefresh,
                    enableCacheClear: true,
                    refreshMessage: 'App refreshed and cache cleared',
                    child: centerContent,
                  ),
                ),
              ],
            ),
          ),

          // Floating Report Hazard Button
          if (_currentPage != 'Login')
            Positioned(
              bottom: 20,
              right: 20,
              child: FloatingActionButton.extended(
                onPressed: () => _onPageChanged('Report Hazard'),
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: Colors.white,
                icon: const Icon(Icons.report_problem),
                label: const Text(
                  'Report Hazard',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                tooltip: 'Report Hazard Now',
              ),
            ),
        ],
      ),
    ),
    );
  }
}


