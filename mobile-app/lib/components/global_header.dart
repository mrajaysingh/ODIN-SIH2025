import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class GlobalHeader extends StatefulWidget {
  final String currentPage;
  final Function(String) onPageChanged;
  final VoidCallback? onLoginPressed;
  final VoidCallback? onLanguageChanged;

  const GlobalHeader({
    super.key,
    required this.currentPage,
    required this.onPageChanged,
    this.onLoginPressed,
    this.onLanguageChanged,
  });

  @override
  State<GlobalHeader> createState() => _GlobalHeaderState();
}

class _GlobalHeaderState extends State<GlobalHeader> {
  String _selectedLanguage = 'EN';

  final List<String> _menuItems = [
    'Home',
    'Report Hazard',
    'Live Alerts',
    'Community',
    'About O.D.I.N.',
  ];

  final List<Map<String, String>> _languages = [
    {'code': 'EN', 'name': 'English'},
    {'code': 'HI', 'name': 'Hindi'},
    {'code': 'ES', 'name': 'Español'},
    {'code': 'FR', 'name': 'Français'},
    {'code': 'DE', 'name': 'Deutsch'},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Alert Bar - Always Visible Red Strip
        Container(
          width: double.infinity,
          color: Colors.red[600],
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.warning,
                color: Colors.white,
                size: 16,
              ),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'LIVE: High tide warning for Mumbai coastal areas - Updated 2 mins ago',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
        
        // Main Navigation Header
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: const Color(0xFF1e3a8a), // Blue color matching web
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(15),
              bottomRight: Radius.circular(15),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            children: [
              // Top Row - Logo and Controls
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Logo Section
                  Expanded(
                    child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.all(4),
                        child: SvgPicture.asset(
                          'assets/ODIN-tp.svg',
                          fit: BoxFit.contain,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Flexible(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'O.D.I.N.',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Ocean Disaster Information Network',
                              style: TextStyle(
                                color: Colors.grey[300],
                                fontSize: 10,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              softWrap: false,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  ),
                  
                  // Right Side Controls
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Language Dropdown
                        PopupMenuButton<String>(
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.language,
                                color: Colors.white,
                                size: 18,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                _selectedLanguage,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const Icon(
                                Icons.arrow_drop_down,
                                color: Colors.white,
                                size: 16,
                              ),
                            ],
                          ),
                          onSelected: (String language) {
                            setState(() {
                              _selectedLanguage = language;
                            });
                            widget.onLanguageChanged?.call();
                          },
                          itemBuilder: (BuildContext context) {
                            return _languages.map((lang) {
                              return PopupMenuItem<String>(
                                value: lang['code'],
                                child: Text(lang['name']!),
                              );
                            }).toList();
                          },
                        ),
                        
                        const SizedBox(width: 8),
                        
                        // Login Button
                        ElevatedButton(
                          onPressed: widget.onLoginPressed,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange[500],
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Login',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Navigation Menu
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _menuItems.map((item) {
                    bool isActive = widget.currentPage == item;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => widget.onPageChanged(item),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isActive
                                ? Colors.blue[600]
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                            border: isActive
                                ? null
                                : Border.all(
                                    color: Colors.white.withValues(alpha: 0.3),
                                    width: 1,
                                  ),
                          ),
                          child: item == 'Home'
                              ? Icon(
                                  isActive
                                      ? Icons.home
                                      : Icons.home_outlined,
                                  color: Colors.white,
                                  size: 16,
                                )
                              : Text(
                                  item,
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: isActive
                                        ? FontWeight.w600
                                        : FontWeight.w400,
                                  ),
                                ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
