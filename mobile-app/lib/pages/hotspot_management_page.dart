import 'package:flutter/material.dart';
import '../data/hotspots_data.dart';

class HotspotManagementPage extends StatefulWidget {
  const HotspotManagementPage({super.key});

  @override
  State<HotspotManagementPage> createState() => _HotspotManagementPageState();
}

class _HotspotManagementPageState extends State<HotspotManagementPage> {
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _latitudeController = TextEditingController();
  final _longitudeController = TextEditingController();
  final _timeToCoastController = TextEditingController();
  final _evacuationTimeController = TextEditingController();
  final _windSpeedController = TextEditingController();
  final _observerController = TextEditingController();

  String _selectedProximityType = 'Tsunami';
  String _selectedSeverity = 'Critical';
  Color _selectedColor = Colors.red;
  bool _isActive = true;

  @override
  void dispose() {
    _idController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    _latitudeController.dispose();
    _longitudeController.dispose();
    _timeToCoastController.dispose();
    _evacuationTimeController.dispose();
    _windSpeedController.dispose();
    _observerController.dispose();
    super.dispose();
  }

  void _clearForm() {
    _idController.clear();
    _titleController.clear();
    _descriptionController.clear();
    _latitudeController.clear();
    _longitudeController.clear();
    _timeToCoastController.clear();
    _evacuationTimeController.clear();
    _windSpeedController.clear();
    _observerController.clear();
    _selectedProximityType = 'Tsunami';
    _selectedSeverity = 'Critical';
    _selectedColor = Colors.red;
    _isActive = true;
  }

  void _loadHotspotData(HotspotData hotspot) {
    _idController.text = hotspot.id;
    _titleController.text = hotspot.title;
    _descriptionController.text = hotspot.description;
    _latitudeController.text = hotspot.latitude.toString();
    _longitudeController.text = hotspot.longitude.toString();
    _timeToCoastController.text = hotspot.timeToCoast;
    _evacuationTimeController.text = hotspot.evacuationTime;
    _windSpeedController.text = hotspot.windSpeed;
    _observerController.text = hotspot.observer;
    _selectedProximityType = hotspot.proximityType;
    _selectedSeverity = hotspot.severity;
    _selectedColor = hotspot.color;
    _isActive = hotspot.isActive;
  }

  void _saveHotspot() {
    if (_formKey.currentState!.validate()) {
      final hotspot = HotspotData(
        id: _idController.text.trim(),
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        latitude: double.parse(_latitudeController.text.trim()),
        longitude: double.parse(_longitudeController.text.trim()),
        proximityType: _selectedProximityType,
        color: _selectedColor,
        severity: _selectedSeverity,
        timeToCoast: _timeToCoastController.text.trim(),
        evacuationTime: _evacuationTimeController.text.trim(),
        windSpeed: _windSpeedController.text.trim(),
        observer: _observerController.text.trim(),
        isActive: _isActive,
      );

      // Check if updating existing hotspot or adding new one
      final existingHotspot = HotspotsRepository.getHotspotById(hotspot.id);
      if (existingHotspot != null) {
        HotspotsRepository.updateHotspot(hotspot.id, hotspot);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Hotspot ${hotspot.id} updated successfully')),
        );
      } else {
        HotspotsRepository.addHotspot(hotspot);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Hotspot ${hotspot.id} added successfully')),
        );
      }

      _clearForm();
      setState(() {});
    }
  }

  void _deleteHotspot(String id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Hotspot'),
        content: Text('Are you sure you want to delete hotspot $id?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              HotspotsRepository.removeHotspot(id);
              Navigator.pop(context);
              setState(() {});
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Hotspot $id deleted successfully')),
              );
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hotspots = HotspotsRepository.getAllHotspots();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hotspot Management'),
        backgroundColor: const Color(0xFF1e3a8a),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: _clearForm,
            icon: const Icon(Icons.clear),
            tooltip: 'Clear Form',
          ),
        ],
      ),
      body: Row(
        children: [
          // Left side - Form
          Expanded(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Hotspot Details',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1e3a8a),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // ID Field
                      TextFormField(
                        controller: _idController,
                        decoration: const InputDecoration(
                          labelText: 'Hotspot ID',
                          hintText: 'e.g., ALT-001',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter a hotspot ID';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Title Field
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'Title',
                          hintText: 'e.g., Tsunami Warning',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter a title';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Description Field
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(
                          labelText: 'Description',
                          hintText: 'Detailed description of the alert',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 3,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter a description';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Coordinates Row
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _latitudeController,
                              decoration: const InputDecoration(
                                labelText: 'Latitude',
                                hintText: 'e.g., 17.6868',
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.number,
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Required';
                                }
                                if (double.tryParse(value.trim()) == null) {
                                  return 'Invalid number';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _longitudeController,
                              decoration: const InputDecoration(
                                labelText: 'Longitude',
                                hintText: 'e.g., 83.2185',
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.number,
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Required';
                                }
                                if (double.tryParse(value.trim()) == null) {
                                  return 'Invalid number';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Proximity Type Dropdown
                      DropdownButtonFormField<String>(
                        value: _selectedProximityType,
                        decoration: const InputDecoration(
                          labelText: 'Proximity Type',
                          border: OutlineInputBorder(),
                        ),
                        items: HotspotsRepository.getProximityTypes()
                            .map((type) => DropdownMenuItem(
                                  value: type,
                                  child: Text(type),
                                ))
                            .toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedProximityType = value!;
                            _selectedColor = HotspotsRepository.getColorForProximityType(value);
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Severity Dropdown
                      DropdownButtonFormField<String>(
                        value: _selectedSeverity,
                        decoration: const InputDecoration(
                          labelText: 'Severity',
                          border: OutlineInputBorder(),
                        ),
                        items: HotspotsRepository.getSeverityLevels()
                            .map((severity) => DropdownMenuItem(
                                  value: severity,
                                  child: Text(severity),
                                ))
                            .toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedSeverity = value!;
                            _selectedColor = HotspotsRepository.getColorForSeverity(value);
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Color Picker
                      Row(
                        children: [
                          const Text('Color: '),
                          const SizedBox(width: 16),
                          GestureDetector(
                            onTap: () {
                              showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: const Text('Select Color'),
                                  content: SingleChildScrollView(
                                    child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        _buildColorOption(Colors.red, 'Red'),
                                        _buildColorOption(Colors.orange, 'Orange'),
                                        _buildColorOption(Colors.yellow, 'Yellow'),
                                        _buildColorOption(Colors.green, 'Green'),
                                        _buildColorOption(Colors.blue, 'Blue'),
                                        _buildColorOption(Colors.purple, 'Purple'),
                                        _buildColorOption(Colors.pink, 'Pink'),
                                        _buildColorOption(Colors.brown, 'Brown'),
                                        _buildColorOption(Colors.black, 'Black'),
                                        _buildColorOption(Colors.grey, 'Grey'),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                            child: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: _selectedColor,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.grey, width: 2),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Time Fields Row
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _timeToCoastController,
                              decoration: const InputDecoration(
                                labelText: 'Time to Coast',
                                hintText: 'e.g., 35 min',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _evacuationTimeController,
                              decoration: const InputDecoration(
                                labelText: 'Evacuation Time',
                                hintText: 'e.g., 20 min',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Wind Speed and Observer Row
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _windSpeedController,
                              decoration: const InputDecoration(
                                labelText: 'Wind Speed',
                                hintText: 'e.g., 28 km/h ↗ NE',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _observerController,
                              decoration: const InputDecoration(
                                labelText: 'Observer',
                                hintText: 'e.g., ODIN Watch',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Active Switch
                      Row(
                        children: [
                          const Text('Active: '),
                          Switch(
                            value: _isActive,
                            onChanged: (value) {
                              setState(() {
                                _isActive = value;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Save Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _saveHotspot,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF1e3a8a),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: const Text(
                            'Save Hotspot',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Right side - Hotspot List
          Expanded(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(
                  left: BorderSide(color: Colors.grey.shade300),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Existing Hotspots',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1e3a8a),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView.builder(
                      itemCount: hotspots.length,
                      itemBuilder: (context, index) {
                        final hotspot = hotspots[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color: hotspot.color,
                                shape: BoxShape.circle,
                              ),
                            ),
                            title: Text(
                              hotspot.title,
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            subtitle: Text('${hotspot.proximityType} - ${hotspot.severity}'),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  onPressed: () => _loadHotspotData(hotspot),
                                  icon: const Icon(Icons.edit),
                                  tooltip: 'Edit',
                                ),
                                IconButton(
                                  onPressed: () => _deleteHotspot(hotspot.id),
                                  icon: const Icon(Icons.delete),
                                  tooltip: 'Delete',
                                ),
                              ],
                            ),
                            onTap: () => _loadHotspotData(hotspot),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildColorOption(Color color, String name) {
    return ListTile(
      leading: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey, width: 2),
        ),
      ),
      title: Text(name),
      onTap: () {
        setState(() {
          _selectedColor = color;
        });
        Navigator.pop(context);
      },
    );
  }
}
