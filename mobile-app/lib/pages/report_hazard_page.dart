import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class ReportHazardPage extends StatefulWidget {
  const ReportHazardPage({super.key});

  @override
  State<ReportHazardPage> createState() => _ReportHazardPageState();
}

class _ReportHazardPageState extends State<ReportHazardPage> {
  final _formKey = GlobalKey<FormState>();
  final _hazardTypeController = TextEditingController();
  final _locationController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _contactController = TextEditingController();
  
  String _selectedSeverity = 'Medium';
  String _selectedHazardType = 'Tsunami Warning';
  bool _isSubmitting = false;
  bool _isGettingLocation = false;

  final List<String> _hazardTypes = [
    'Tsunami Warning',
    'High Tide',
    'Storm/Cyclone',
    'Coastal Flooding',
    'Oil Spill',
    'Marine Pollution',
    'Rip Current',
    'Unusual Wave Activity',
    'Coastal Erosion',
    'Flash Flood',
    'Other',
  ];

  final List<String> _severityLevels = [
    'Critical',
    'High',
    'Medium',
    'Low',
  ];

  final List<Map<String, String>> _emergencyNumbers = [
    {'service': 'Coast Guard Emergency', 'number': '1554'},
    {'service': 'NDRF Emergency', 'number': '1070'},
    {'service': 'Disaster Helpline', 'number': '1077'},
    {'service': 'Police Emergency', 'number': '112'},
    {'service': 'Fire Emergency', 'number': '101'},
    {'service': 'Medical Emergency', 'number': '108'},
  ];

  @override
  void dispose() {
    _hazardTypeController.dispose();
    _locationController.dispose();
    _descriptionController.dispose();
    _contactController.dispose();
    super.dispose();
  }

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isGettingLocation = true;
    });

    try {
      final permission = await Permission.location.request();
      if (permission != PermissionStatus.granted) {
        _showSnackBar('Location permission denied');
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _locationController.text = '${position.latitude.toStringAsFixed(6)}, ${position.longitude.toStringAsFixed(6)}';
        _isGettingLocation = false;
      });

      _showSnackBar('Location captured successfully');
    } catch (e) {
      setState(() {
        _isGettingLocation = false;
      });
      _showSnackBar('Failed to get location: $e');
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: const Color(0xFF1e3a8a),
      ),
    );
  }

  void _callEmergencyNumber(String number) async {
    try {
      // Check if we're on a platform that supports phone calls
      if (kIsWeb) {
        _showSnackBar('Phone dialing not supported on web. Please dial $number manually.');
        return;
      }
      
      final Uri phoneUri = Uri.parse('tel:$number');
      
      // Try to launch the phone dialer
      final bool launched = await launchUrl(
        phoneUri,
        mode: LaunchMode.externalApplication,
      );
      
      if (!launched) {
        // If launch failed, show manual dial option
        _showSnackBar('Phone dialer not available. Please dial $number manually.');
      } else {
        _showSnackBar('Opening phone dialer for $number...');
      }
      
    } catch (e) {
      // If there's an error, show manual dial option
      _showSnackBar('Please dial $number manually. Error: ${e.toString()}');
    }
  }

  void _submitReport() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _isSubmitting = false;
      });

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 28),
              SizedBox(width: 8),
              Text('Report Submitted'),
            ],
          ),
          content: const Text(
            'Your hazard report has been submitted successfully. Emergency services have been notified.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('OK'),
            ),
          ],
      ),
    );
  }
}

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header section that extends behind headers
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(20, 15, 20, 8),
          decoration: const BoxDecoration(
            color: Color(0xFFF59E0B),
          ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.warning, color: Colors.white, size: 28),
                    SizedBox(width: 12),
                    Text(
                      'Report Ocean Hazard',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  'Help protect coastal communities by reporting hazards immediately. Your report could save lives.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          // Form content with white background
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFFf9fafb),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      // Form fields
                      _buildFormFields(),
                      const SizedBox(height: 24),

                      // Submit Button
                      _buildSubmitButton(),
                      const SizedBox(height: 24),

                      // Emergency Contacts
                      _buildEmergencyContacts(),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
    );
  }

  Widget _buildFormFields() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Hazard Type
        const Text(
          'Hazard Type',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1e3a8a)),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _selectedHazardType,
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          ),
          items: _hazardTypes.map((type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
          onChanged: (value) => setState(() => _selectedHazardType = value!),
          validator: (value) => value == null || value.isEmpty ? 'Please select a hazard type' : null,
        ),
        const SizedBox(height: 16),

        // Severity
        const Text(
          'Severity Level',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1e3a8a)),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _selectedSeverity,
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          ),
          items: _severityLevels.map((severity) => DropdownMenuItem(
            value: severity,
            child: Row(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(color: _getSeverityColor(severity), shape: BoxShape.circle),
                ),
                const SizedBox(width: 8),
                Text(severity),
              ],
            ),
          )).toList(),
          onChanged: (value) => setState(() => _selectedSeverity = value!),
        ),
        const SizedBox(height: 16),

        // Location
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Location',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1e3a8a)),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _locationController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      hintText: 'Enter location or coordinates',
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    validator: (value) => value == null || value.trim().isEmpty ? 'Please enter location' : null,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            ElevatedButton.icon(
              onPressed: _isGettingLocation ? null : _getCurrentLocation,
              icon: _isGettingLocation
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : const Icon(Icons.my_location),
              label: Text(_isGettingLocation ? 'Getting...' : 'Get Location'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1e3a8a),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Description
        const Text(
          'Description',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1e3a8a)),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _descriptionController,
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            hintText: 'Describe the hazard in detail...',
            contentPadding: const EdgeInsets.all(12),
          ),
          maxLines: 4,
          validator: (value) => value == null || value.trim().isEmpty ? 'Please provide a description' : null,
        ),
        const SizedBox(height: 16),

        // Contact
        const Text(
          'Contact Information (Optional)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1e3a8a)),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: _contactController,
          decoration: InputDecoration(
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            hintText: 'Your phone number or email',
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          ),
          keyboardType: TextInputType.phone,
        ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isSubmitting ? null : _submitReport,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFF59E0B),
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: _isSubmitting
            ? const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  ),
                  SizedBox(width: 12),
                  Text('Submitting Report...'),
                ],
              )
            : const Text(
                'Submit Report',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
      ),
    );
  }

  Widget _buildEmergencyContacts() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.emergency, color: Colors.red, size: 24),
                SizedBox(width: 8),
                Text(
                  'Emergency Contacts',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1e3a8a)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ..._emergencyNumbers.map((contact) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.phone, color: Colors.red.shade600, size: 20),
                ),
                title: Text(contact['service']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text(
                  contact['number']!,
                  style: TextStyle(color: Colors.red.shade600, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                trailing: ElevatedButton(
                  onPressed: () => _callEmergencyNumber(contact['number']!),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(60, 36),
                  ),
                  child: const Text('Call'),
                ),
              ),
            )).toList(),
          ],
        ),
      ),
    );
  }

  Color _getSeverityColor(String severity) {
    switch (severity) {
      case 'Critical':
        return Colors.red;
      case 'High':
        return Colors.orange;
      case 'Medium':
        return Colors.yellow;
      case 'Low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}