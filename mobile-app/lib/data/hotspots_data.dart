import 'package:flutter/material.dart';

class HotspotData {
  final String id;
  final String title;
  final String description;
  final double latitude;
  final double longitude;
  final String proximityType;
  final Color color;
  final String severity;
  final String timeToCoast;
  final String evacuationTime;
  final String windSpeed;
  final String observer;
  final bool isActive;

  const HotspotData({
    required this.id,
    required this.title,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.proximityType,
    required this.color,
    required this.severity,
    required this.timeToCoast,
    required this.evacuationTime,
    required this.windSpeed,
    required this.observer,
    this.isActive = true,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'proximityType': proximityType,
      'color': color.value,
      'severity': severity,
      'timeToCoast': timeToCoast,
      'evacuationTime': evacuationTime,
      'windSpeed': windSpeed,
      'observer': observer,
      'isActive': isActive,
    };
  }

  factory HotspotData.fromMap(Map<String, dynamic> map) {
    return HotspotData(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      latitude: map['latitude']?.toDouble() ?? 0.0,
      longitude: map['longitude']?.toDouble() ?? 0.0,
      proximityType: map['proximityType'] ?? '',
      color: Color(map['color'] ?? Colors.red.value),
      severity: map['severity'] ?? '',
      timeToCoast: map['timeToCoast'] ?? '',
      evacuationTime: map['evacuationTime'] ?? '',
      windSpeed: map['windSpeed'] ?? '',
      observer: map['observer'] ?? '',
      isActive: map['isActive'] ?? true,
    );
  }
}

class HotspotsRepository {
  static final List<HotspotData> _hotspots = [
    // Oil Spill - Orange (Medium Risk)
    HotspotData(
      id: 'oil-spill-alert-1',
      title: 'Proximity Alert',
      description: 'Oil spill detected in coastal waters',
      latitude: 8.382704,
      longitude: 76.503065,
      proximityType: 'Oil Spill',
      color: const Color(0xFFea580c), // Orange
      severity: 'Medium',
      timeToCoast: '50 min',
      evacuationTime: '25 min',
      windSpeed: '18 km/h → E',
      observer: 'Coastal Ops',
    ),

    // Tsunami Warning - Red (Critical Risk)
    HotspotData(
      id: 'tsunami-alert-2',
      title: 'Critical Alert',
      description: 'Tsunami warning for coastal regions',
      latitude: 13.082680,
      longitude: 80.278152,
      proximityType: 'Tsunami Warning',
      color: const Color(0xFFdc2626), // Red
      severity: 'Critical',
      timeToCoast: '30 min',
      evacuationTime: '15 min',
      windSpeed: '25 km/h → SE',
      observer: 'NDRF Emergency',
    ),

    // High Tide - Yellow (Medium Risk)
    HotspotData(
      id: 'tsunami-alert-3',
      title: 'Critical Alert',
      description: 'High tide warning for coastal areas',
      latitude: 6.700032,
      longitude: 72.509193,
      proximityType: 'Tsunami Warning',
      color: const Color(0xFFeab308), // Yellow
      severity: 'Critical',
      timeToCoast: '30 min',
      evacuationTime: '15 min',
      windSpeed: '25 km/h → SE',
      observer: 'Rahul Mannjhi',
    ),

    // Flood Warning - Blue (High Risk)
    HotspotData(
      id: 'flood-1',
      title: 'Proximity Alert',
      description: 'Flood warning for coastal regions',
      latitude: 8.382704,
      longitude: 76.503065,
      proximityType: 'Flood Warning',
      color: const Color(0xFF2563eb), // Blue
      severity: 'Emergency priority 1',
      timeToCoast: '30 min',
      evacuationTime: '15 min',
      windSpeed: '25 km/h → SE',
      observer: 'kushagra kanaujia',
    ),

    // Flood Warning - Green (Low Risk)
    HotspotData(
      id: 'flood-2',
      title: 'Proximity Alert',
      description: 'Flood warning for coastal regions',
      latitude: 6.961585,
      longitude: 76.843094,
      proximityType: 'Flood Warning',
      color: const Color(0xFF10b981), // Green
      severity: 'Emergency priority 1',
      timeToCoast: '30 min',
      evacuationTime: '15 min',
      windSpeed: '25 km/h → SE',
      observer: 'kushagra kanaujia',
    ),

    // Additional hotspots for better coverage
    HotspotData(
      id: 'ALT-001',
      title: 'Tsunami Warning',
      description: 'High risk area - Evacuation recommended',
      latitude: 17.6868,
      longitude: 83.2185,
      proximityType: 'Tsunami',
      color: const Color(0xFFdc2626), // Red
      severity: 'Critical',
      timeToCoast: '35 min',
      evacuationTime: '20 min',
      windSpeed: '28 km/h ↗ NE',
      observer: 'ODIN Watch',
    ),

    HotspotData(
      id: 'ALT-002',
      title: 'High Tide',
      description: 'Abnormal high tide levels causing coastal flooding',
      latitude: 19.0760,
      longitude: 72.8777,
      proximityType: 'High Tide',
      color: const Color(0xFFea580c), // Orange
      severity: 'High',
      timeToCoast: '15 min',
      evacuationTime: '10 min',
      windSpeed: '22 km/h ↗ E',
      observer: 'Mumbai Coast Guard',
    ),

    HotspotData(
      id: 'ALT-003',
      title: 'Storm Surge Alert',
      description: 'Storm surge warning for coastal regions',
      latitude: 13.0827,
      longitude: 80.2707,
      proximityType: 'Storm Surge',
      color: const Color(0xFFeab308), // Yellow
      severity: 'Medium',
      timeToCoast: '45 min',
      evacuationTime: '30 min',
      windSpeed: '35 km/h ↗ SE',
      observer: 'Chennai Weather Station',
    ),

    HotspotData(
      id: 'ALT-004',
      title: 'Rip Current Warning',
      description: 'Strong rip currents detected',
      latitude: 15.2993,
      longitude: 74.1240,
      proximityType: 'Rip Current',
      color: const Color(0xFF10b981), // Green
      severity: 'Low',
      timeToCoast: 'Immediate',
      evacuationTime: '5 min',
      windSpeed: '18 km/h ↗ SW',
      observer: 'Goa Beach Patrol',
    ),
  ];

  static List<HotspotData> getAllHotspots() {
    return _hotspots.where((hotspot) => hotspot.isActive).toList();
  }

  static List<HotspotData> getHotspotsByType(String proximityType) {
    return _hotspots
        .where((hotspot) => 
            hotspot.isActive && hotspot.proximityType == proximityType)
        .toList();
  }

  static List<HotspotData> getHotspotsBySeverity(String severity) {
    return _hotspots
        .where((hotspot) => 
            hotspot.isActive && hotspot.severity == severity)
        .toList();
  }

  static HotspotData? getHotspotById(String id) {
    try {
      return _hotspots.firstWhere((hotspot) => hotspot.id == id);
    } catch (e) {
      return null;
    }
  }

  static void addHotspot(HotspotData hotspot) {
    _hotspots.add(hotspot);
  }

  static void removeHotspot(String id) {
    _hotspots.removeWhere((hotspot) => hotspot.id == id);
  }

  static void updateHotspot(String id, HotspotData updatedHotspot) {
    final index = _hotspots.indexWhere((hotspot) => hotspot.id == id);
    if (index != -1) {
      _hotspots[index] = updatedHotspot;
    }
  }

  static List<String> getProximityTypes() {
    return [
      'Tsunami',
      'High Tide',
      'Storm Surge',
      'Rip Current',
      'Flash Flood',
      'Cyclone',
      'Coastal Erosion',
      'Oil Spill',
      'Marine Pollution',
      'Sea Level Rise',
      'Coral Bleaching',
      'Marine Heatwave',
    ];
  }

  static List<String> getSeverityLevels() {
    return [
      'Critical',
      'High',
      'Medium',
      'Low',
      'Info',
    ];
  }

  static Color getColorForSeverity(String severity) {
    switch (severity.toLowerCase()) {
      case 'critical':
        return const Color(0xFFdc2626); // Red
      case 'high':
        return const Color(0xFFea580c); // Orange
      case 'medium':
        return const Color(0xFFeab308); // Yellow
      case 'low':
        return const Color(0xFF10b981); // Green
      case 'info':
        return const Color(0xFF10b981); // Green
      default:
        return const Color(0xFF6b7280); // Grey
    }
  }

  static Color getColorForProximityType(String proximityType) {
    switch (proximityType.toLowerCase()) {
      case 'tsunami':
      case 'tsunami warning':
        return const Color(0xFFdc2626); // Red
      case 'cyclone':
        return const Color(0xFFdc2626); // Red
      case 'high tide':
        return const Color(0xFFea580c); // Orange
      case 'storm surge':
        return const Color(0xFFeab308); // Yellow
      case 'flash flood':
        return const Color(0xFFea580c); // Orange
      case 'rip current':
        return const Color(0xFF10b981); // Green
      case 'coastal erosion':
        return const Color(0xFFeab308); // Yellow
      case 'oil spill':
        return const Color(0xFFea580c); // Orange
      case 'flood warning':
        return const Color(0xFF2563eb); // Blue (for flood warnings)
      case 'marine pollution':
        return const Color(0xFFeab308); // Yellow
      case 'sea level rise':
        return const Color(0xFF10b981); // Green
      case 'coral bleaching':
        return const Color(0xFFeab308); // Yellow
      case 'marine heatwave':
        return const Color(0xFFea580c); // Orange
      default:
        return const Color(0xFF6b7280); // Grey
    }
  }
}
