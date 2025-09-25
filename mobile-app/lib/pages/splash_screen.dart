import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:to_do_app/pages/permission_gate_page.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late final AnimationController _fadeController;
  late final Animation<double> _fadeOut;
  late final AnimationController _spinController;
  Timer? _timer;
  Timer? _fadeTimer;
  late final AudioPlayer _audioPlayer;
  Timer? _audioStopTimer;
  

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _spinController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
    _fadeOut = Tween<double>(begin: 1, end: 0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeOut),
    );
    // Prepare audio
    _audioPlayer = AudioPlayer();
    _audioPlayer.setReleaseMode(ReleaseMode.stop);
    // Start audio immediately
    () async {
      try {
        await _audioPlayer.setVolume(1.0);
        await _audioPlayer.play(AssetSource('startup-sound/startup.mp3'));
        _audioStopTimer = Timer(const Duration(seconds: 5), () async {
          await _audioPlayer.stop();
        });
      } catch (_) {}
    }();

    // Start fade-out shortly before navigating for a smooth transition
    _fadeTimer = Timer(const Duration(milliseconds: 5500), () {
      if (mounted) _fadeController.forward();
    });
    _timer = Timer(const Duration(seconds: 6), _navigateNext);
    
  }

  void _navigateNext() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(_buildFadeRoute());
  }

  PageRouteBuilder _buildFadeRoute() {
    return PageRouteBuilder(
      transitionDuration: const Duration(milliseconds: 400),
      pageBuilder: (_, __, ___) => const PermissionGatePage(),
      transitionsBuilder: (_, animation, __, child) {
        return FadeTransition(
          opacity: CurvedAnimation(parent: animation, curve: Curves.easeOut),
          child: child,
        );
      },
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _fadeTimer?.cancel();
    _audioStopTimer?.cancel();
    _audioPlayer.stop();
    _audioPlayer.dispose();
    _fadeController.dispose();
    _spinController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: FadeTransition(
        opacity: _fadeOut,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Static image as background
            Image.asset(
              'assets/splash/bg-splash-imag.jpg',
              fit: BoxFit.cover,
            ),
            // Optional subtle overlay for readability during splash
            Container(color: Colors.black.withValues(alpha: 0.2)),
            // Full-screen glassmorphism layer
            Positioned.fill(
              child: ClipRRect(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
                  child: Container(
                    color: Colors.white.withValues(alpha: 0.08),
                  ),
                ),
              ),
            ),
            // Centered brand logo (rotating)
            Center(
              child: RotationTransition(
                turns: _spinController,
                child: SvgPicture.asset(
                  'assets/ODIN-tp.svg',
                  width: 168,
                  height: 168,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}