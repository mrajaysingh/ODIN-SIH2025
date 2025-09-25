import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:geolocator/geolocator.dart';
import '../data/hotspots_data.dart';

class OdinMapWidget extends StatefulWidget {
  final bool isFullScreen;
  
  const OdinMapWidget({
    super.key,
    this.isFullScreen = false,
  });

  @override
  State<OdinMapWidget> createState() => _OdinMapWidgetState();
}

class _OdinMapWidgetState extends State<OdinMapWidget> {
  MapLibreMapController? mapController;
  bool _isSatelliteView = true;
  bool _isLoadingLocation = false;

  // Default location coordinates
  static const double defaultLat = 8.105443;
  static const double defaultLng = 76.417411;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: widget.isFullScreen ? null : BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: widget.isFullScreen ? BorderRadius.zero : BorderRadius.circular(12),
        child: Stack(
          children: [
            // Main Map with Gesture Detection
            GestureDetector(
              onTap: () {
                // Show all hotspots dialog when map is tapped
                _showAllHotspotsDialog();
              },
              child: MapLibreMap(
                onMapCreated: _onMapCreated,
                initialCameraPosition: const CameraPosition(
                  target: LatLng(defaultLat, defaultLng),
                  zoom: 5,
                  bearing: 0, // Always keep north up
                ),
                styleString: _isSatelliteView 
                    ? 'https://api.maptiler.com/maps/hybrid/style.json?key=Slx857nSZ7JmUiCsJzsj'
                    : 'https://api.maptiler.com/maps/streets/style.json?key=Slx857nSZ7JmUiCsJzsj',
                myLocationEnabled: false,
                compassEnabled: false,
                rotateGesturesEnabled: false, // Disable rotation gestures
                tiltGesturesEnabled: false, // Disable tilt gestures
                minMaxZoomPreference: const MinMaxZoomPreference(3, 7),
              ),
            ),
            
            // Map Controls
            if (widget.isFullScreen) ...[
              Positioned(
                top: 16,
                right: 16,
                child: _buildControlButton(
                  icon: _isSatelliteView ? Icons.map : Icons.satellite,
                  onPressed: _toggleMapStyle,
                  tooltip: _isSatelliteView ? "Switch to Street View" : "Switch to Satellite View",
                ),
              ),
              Positioned(
                top: 80,
                right: 16,
                child: _buildControlButton(
                  icon: Icons.my_location,
                  onPressed: _getCurrentLocation,
                  isLoading: _isLoadingLocation,
                  tooltip: "Get My Current Location",
                ),
              ),
            ],
            
            Positioned(
              bottom: widget.isFullScreen ? 80 : 80,
              left: widget.isFullScreen ? 16 : 16,
              child: _buildControlButton(
                icon: _isSatelliteView ? Icons.map : Icons.satellite,
                onPressed: _toggleMapStyle,
                tooltip: _isSatelliteView ? "Switch to Street View" : "Switch to Satellite View",
              ),
            ),
            
            Positioned(
              bottom: widget.isFullScreen ? 16 : 16,
              left: 16,
              child: _buildControlButton(
                icon: Icons.my_location,
                onPressed: _getCurrentLocation,
                isLoading: _isLoadingLocation,
                tooltip: "Get My Current Location",
              ),
            ),
            
            Positioned(
              bottom: widget.isFullScreen ? 16 : 16,
              right: 16,
              child: _buildControlButton(
                icon: Icons.refresh,
                onPressed: _resetToDefaultLocation,
                tooltip: "Reset to Default Location",
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required VoidCallback onPressed,
    String? tooltip,
    bool isLoading = false,
  }) {
    return Tooltip(
      message: tooltip ?? '',
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(8),
            onTap: isLoading ? null : onPressed,
            child: Container(
              padding: const EdgeInsets.all(12),
              child: isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                      ),
                    )
                  : Icon(
                      icon,
                      size: 20,
                      color: Colors.grey[700],
                    ),
            ),
          ),
        ),
      ),
    );
  }

  void _onMapCreated(MapLibreMapController controller) {
    print('Map created successfully');
    mapController = controller;
    
    // Add place labels to the map
    _addPlaceLabels();
    
    // Add hotspots with a delay to ensure map is fully loaded
    Future.delayed(const Duration(milliseconds: 2000), () {
      print('Starting to add sample markers after delay');
      _addSampleMarkers();
      _fitMapToHotspots();
    });
  }

  void _showAllHotspotsDialog() {
    final hotspots = HotspotsRepository.getAllHotspots();
    
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text(
            'Disaster Hotspots',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF1e3a8a),
            ),
          ),
          content: Container(
            constraints: const BoxConstraints(maxWidth: 400, maxHeight: 500),
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: hotspots.length,
              itemBuilder: (context, index) {
                final hotspot = hotspots[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  child: ListTile(
                    leading: Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: hotspot.color,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                    ),
                    title: Text(
                      hotspot.title,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text('${hotspot.proximityType} - ${hotspot.severity}'),
                    onTap: () {
                      Navigator.of(context).pop();
                      _showHotspotDetails(hotspot);
                    },
                  ),
                );
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }


  void _addPlaceLabels() {
    if (mapController == null) return;

    try {
      // Add vector source for labels
      mapController!.addSource(
        'maptiler-vector',
        VectorSourceProperties(
          url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=Slx857nSZ7JmUiCsJzsj',
        ),
      );

      // Add place points (markers for cities, towns, etc.)
      mapController!.addLayer(
        'maptiler-vector',
        'place-points',
        CircleLayerProperties(
          circleColor: '#E7000B',
          circleRadius: 3,
          circleStrokeColor: '#000000',
          circleStrokeWidth: 1,
        ),
      );

      // Add place labels (cities, towns, etc.)
      mapController!.addLayer(
        'maptiler-vector',
        'place-labels',
        SymbolLayerProperties(
          textField: ['get', 'name'],
          textFont: ['Lato', 'Arial Unicode MS Regular'],
          textSize: 12,
          textTransform: 'uppercase',
          textLetterSpacing: 0.1,
          textOffset: const Offset(0, 1.5),
          textAnchor: 'top',
          textColor: '#ffffff',
        ),
      );

      // Add road labels
      mapController!.addLayer(
        'maptiler-vector',
        'road-labels',
        SymbolLayerProperties(
          textField: ['get', 'name'],
          textFont: ['Lato', 'Arial Unicode MS Regular'],
          textSize: 10,
          textTransform: 'uppercase',
          textLetterSpacing: 0.1,
          symbolPlacement: 'line',
          textRotationAlignment: 'map',
          textColor: '#ffffff',
        ),
      );
    } catch (e) {
      print('Error adding place labels: $e');
      // If adding layers fails, we'll try a simpler approach
      _addSimplePlaceLabels();
    }
  }

  void _addSimplePlaceLabels() {
    if (mapController == null) return;

    // Add some manual place labels for key locations
    final keyLocations = [
      {'name': 'Kochi', 'lat': 9.9312, 'lng': 76.2673},
      {'name': 'Thiruvananthapuram', 'lat': 8.5241, 'lng': 76.9366},
      {'name': 'Kozhikode', 'lat': 11.2588, 'lng': 75.7804},
      {'name': 'Mangalore', 'lat': 12.9141, 'lng': 74.8560},
      {'name': 'Goa', 'lat': 15.2993, 'lng': 74.1240},
      {'name': 'Mumbai', 'lat': 19.0760, 'lng': 72.8777},
      {'name': 'Chennai', 'lat': 13.0827, 'lng': 80.2707},
      {'name': 'Visakhapatnam', 'lat': 17.6868, 'lng': 83.2185},
    ];

    for (final location in keyLocations) {
      mapController!.addSymbol(
        SymbolOptions(
          geometry: LatLng(location['lat'] as double, location['lng'] as double),
          textField: location['name'] as String,
          textSize: 12,
          textColor: '#ffffff',
          textHaloColor: '#000000',
          textHaloWidth: 2,
          textOffset: const Offset(0, 2),
        ),
      );
    }
  }

  void _addSampleMarkers() {
    if (mapController == null) {
      print('Map controller is null, cannot add markers');
      return;
    }

    // Get hotspots from the data repository
    final hotspots = HotspotsRepository.getAllHotspots();
    print('Found ${hotspots.length} hotspots to add to map');

    for (final hotspot in hotspots) {
      print('Adding hotspot: ${hotspot.title} at ${hotspot.latitude}, ${hotspot.longitude}');
      _addHotspotMarker(hotspot);
    }
  }

  void _fitMapToHotspots() {
    if (mapController == null) return;
    
    final hotspots = HotspotsRepository.getAllHotspots();
    if (hotspots.isEmpty) return;
    
    // Calculate bounds to fit all hotspots
    double minLat = hotspots.first.latitude;
    double maxLat = hotspots.first.latitude;
    double minLng = hotspots.first.longitude;
    double maxLng = hotspots.first.longitude;
    
    for (final hotspot in hotspots) {
      minLat = minLat < hotspot.latitude ? minLat : hotspot.latitude;
      maxLat = maxLat > hotspot.latitude ? maxLat : hotspot.latitude;
      minLng = minLng < hotspot.longitude ? minLng : hotspot.longitude;
      maxLng = maxLng > hotspot.longitude ? maxLng : hotspot.longitude;
    }
    
    // Add some padding
    const double padding = 0.5;
    minLat -= padding;
    maxLat += padding;
    minLng -= padding;
    maxLng += padding;
    
    print('Fitting map to bounds: lat($minLat, $maxLat), lng($minLng, $maxLng)');
    
    // Fit the map to show all hotspots
    mapController!.animateCamera(
      CameraUpdate.newLatLngBounds(
        LatLngBounds(
          southwest: LatLng(minLat, minLng),
          northeast: LatLng(maxLat, maxLng),
        ),
      ),
    );
  }

  void _addHotspotMarker(HotspotData hotspot) {
    if (mapController == null) {
      print('Map controller is null in _addHotspotMarker');
      return;
    }

    try {
      // Convert Flutter Color to hex string
      String colorHex = '#${hotspot.color.value.toRadixString(16).substring(2).toUpperCase()}';
      print('Adding circle marker with color: $colorHex');
      
      // Add a circular marker similar to the frontend
      mapController!.addCircle(
        CircleOptions(
          geometry: LatLng(hotspot.latitude, hotspot.longitude),
          circleRadius: 12.5, // Reduced by 50% from 25.0
          circleColor: colorHex,
          circleStrokeColor: '#ffffff',
          circleStrokeWidth: 2.0, // Reduced by 50% from 4.0
          circleOpacity: 1.0,
          circleStrokeOpacity: 1.0,
        ),
      );

      // Add a small text label below the marker
      mapController!.addSymbol(
        SymbolOptions(
          geometry: LatLng(hotspot.latitude, hotspot.longitude),
          textField: hotspot.title,
          textSize: 10, // Reduced from 12 to maintain proportion
          textColor: '#ffffff',
          textHaloColor: '#000000',
          textHaloWidth: 2, // Reduced from 3 to maintain proportion
          textOffset: const Offset(0, 3.0), // Adjusted position for smaller circle
          textAnchor: 'top',
        ),
      );
      print('Successfully added hotspot marker for: ${hotspot.title}');
    } catch (e) {
      print('Error adding hotspot marker: $e');
    }
  }

  void _showHotspotDetails(HotspotData hotspot) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Color(hotspot.color.value),
          title: Text(
            hotspot.title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          content: Container(
            constraints: const BoxConstraints(maxWidth: 300),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildDetailRow('Alert', hotspot.proximityType),
                _buildDetailRow('Time to Coast', hotspot.timeToCoast),
                _buildDetailRow('Evacuation Time', hotspot.evacuationTime),
                _buildDetailRow('Wind', hotspot.windSpeed),
                _buildDetailRow('Observer', hotspot.observer),
                const SizedBox(height: 8),
                Text(
                  'Lat ${hotspot.latitude.toStringAsFixed(6)}, Lng ${hotspot.longitude.toStringAsFixed(6)}',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.85),
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text(
                'Close',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  void _toggleMapStyle() {
    setState(() {
      _isSatelliteView = !_isSatelliteView;
    });
    
    // Note: MapLibre GL doesn't support dynamic style changes in this version
    // The style will be applied on the next widget rebuild
    // Re-add place labels and hotspots after style change
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mapController != null) {
        _addPlaceLabels();
        _addSampleMarkers();
      }
    });
  }

  void _getCurrentLocation() async {
    setState(() {
      _isLoadingLocation = true;
    });

    try {
      // Check location permission
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _showSnackBar('Location permission denied');
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _showSnackBar('Location permissions are permanently denied');
        return;
      }

      // Get current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      
      final double currentLat = position.latitude;
      final double currentLng = position.longitude;
      
      if (mapController != null) {
        // Animate to current location
        await mapController!.animateCamera(
          CameraUpdate.newCameraPosition(
            CameraPosition(
              target: LatLng(currentLat, currentLng),
              zoom: 15,
              bearing: 0, // Keep north up
            ),
          ),
        );

        // Add a location pin for current location
        mapController!.addSymbol(
          SymbolOptions(
            geometry: LatLng(currentLat, currentLng),
            iconImage: 'marker',
            iconSize: 1.2,
            iconColor: '#FF0000',
            textField: '📍 You are here',
            textSize: 12,
            textColor: '#ffffff',
            textHaloColor: '#000000',
            textHaloWidth: 2,
            textOffset: const Offset(0, 2.5),
            textAnchor: 'top',
          ),
        );

        _showSnackBar('Location found: ${currentLat.toStringAsFixed(4)}, ${currentLng.toStringAsFixed(4)}');
      }
    } catch (e) {
      if (mounted) {
        _showSnackBar('Error getting location: $e');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingLocation = false;
        });
      }
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.blue,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _resetToDefaultLocation() {
    if (mapController != null) {
      mapController!.animateCamera(
        CameraUpdate.newCameraPosition(
          const CameraPosition(
            target: LatLng(defaultLat, defaultLng),
            zoom: 5,
            bearing: 0, // Keep north up
          ),
        ),
      );
    }
  }
}
