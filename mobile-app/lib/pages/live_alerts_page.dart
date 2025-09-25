import 'package:flutter/material.dart';
import 'package:to_do_app/widgets/odin_map_widget.dart';
import 'package:to_do_app/data/hotspots_data.dart';

class LiveAlertsPage extends StatefulWidget {
  const LiveAlertsPage({super.key});

  @override
  State<LiveAlertsPage> createState() => _LiveAlertsPageState();
}

class _LiveAlertsPageState extends State<LiveAlertsPage> {

  @override
  Widget build(BuildContext context) {
    final hotspots = HotspotsRepository.getAllHotspots();
    
    return Container(
      color: const Color(0xFFf9fafb),
      child: Column(
        children: [
          // Header with legend
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFF1e3a8a),
            ),
            child: Column(
              children: [
                const Text(
                  'Live Ocean Alerts',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                // Color legend
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildLegendItem('Critical', const Color(0xFFdc2626)), // Red
                    _buildLegendItem('High', const Color(0xFFea580c)), // Orange
                    _buildLegendItem('Medium', const Color(0xFFeab308)), // Yellow
                    _buildLegendItem('Low', const Color(0xFF10b981)), // Green
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${hotspots.length} Active Alerts',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          // Full screen map
          Expanded(
            child: const OdinMapWidget(isFullScreen: true),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 1),
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 10,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}


