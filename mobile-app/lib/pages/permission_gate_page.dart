import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:to_do_app/pages/header_only_page.dart';

class PermissionGatePage extends StatefulWidget {
  const PermissionGatePage({super.key});

  @override
  State<PermissionGatePage> createState() => _PermissionGatePageState();
}

class _PermissionGatePageState extends State<PermissionGatePage> {
  bool _requesting = false;

  Future<void> _requestAll() async {
    if (_requesting) return;
    setState(() => _requesting = true);

    // Request permissions sequentially to ensure OS dialogs appear clearly
    final List<Permission> order = [
      Permission.locationWhenInUse,
      Permission.camera,
      Permission.notification,
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
    ];
    for (final p in order) {
      final status = await p.status;
      if (status.isGranted) continue;
      await p.request();
      await Future.delayed(const Duration(milliseconds: 250));
    }

    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HeaderOnlyPage()),
    );
  }

  void _skipForNow() {
    // Navigate to main app without requesting permissions
    // This doesn't persist any state, so the permission screen will show again on next startup
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HeaderOnlyPage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              const Text(
                'Permissions',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Color(0xFF1e3a8a)),
              ),
              const SizedBox(height: 10),
              const Text(
                'We need a few permissions to enable location-based alerts, camera features, nearby sharing and notifications.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF374151)),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: _requesting ? null : _requestAll,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text(_requesting ? 'Requesting…' : 'Continue'),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: () async {
                  await openAppSettings();
                },
                child: const Text('Open App Settings'),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: _requesting ? null : _skipForNow,
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFF6B7280),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text(
                  'SKIP FOR NOW',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}


