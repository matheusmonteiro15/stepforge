import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'providers/measurements_provider.dart';

class AddMeasurementScreen extends ConsumerStatefulWidget {
  const AddMeasurementScreen({super.key});

  @override
  ConsumerState<AddMeasurementScreen> createState() => _AddMeasurementScreenState();
}

class _AddMeasurementScreenState extends ConsumerState<AddMeasurementScreen> {
  final TextEditingController _weightController = TextEditingController(text: '83');
  final TextEditingController _waistController = TextEditingController();
  String? _imageUrl;

  @override
  void dispose() {
    _weightController.dispose();
    _waistController.dispose();
    super.dispose();
  }

  void _saveMeasurement() {
    final double? weight = double.tryParse(_weightController.text.trim());
    if (weight == null || weight <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, insira um peso válido.')),
      );
      return;
    }

    final double? waist = double.tryParse(_waistController.text.trim());

    ref.read(measurementsProvider.notifier).addMeasurement(
      weight,
      waist: waist,
      imageUrl: _imageUrl,
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      appBar: AppBar(
        leading: TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancelar', style: TextStyle(color: Colors.blue, fontSize: 16)),
        ),
        leadingWidth: 90,
        title: Text(
          'Registrar Medições',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: _saveMeasurement,
            child: const Text('Salvar', style: TextStyle(color: Colors.blue, fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Linha da Data
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Data',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white70 : Colors.black87,
                  ),
                ),
                Text(
                  '25 Maio 2026',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Imagem do progresso
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Imagem do progresso',
                  style: TextStyle(
                    fontSize: 15,
                    color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Icon(Icons.help_outline, color: Colors.grey.shade400, size: 20),
              ],
            ),
            const SizedBox(height: 12),

            // Container pontilhado/tracejado para upload
            Container(
              width: double.infinity,
              height: 110,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E1E1E) : Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.grey.shade700,
                  width: 1.5,
                  style: BorderStyle.solid,
                ),
              ),
              child: InkWell(
                onTap: () {
                  // Simula carregamento de imagem
                  setState(() {
                    _imageUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200';
                  });
                },
                borderRadius: BorderRadius.circular(12),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.camera_alt_outlined, color: Colors.blue.shade400, size: 32),
                      const SizedBox(height: 8),
                      Text(
                        _imageUrl == null ? 'Adicionar imagem' : 'Imagem adicionada! Clique para trocar',
                        style: TextStyle(
                          color: Colors.blue.shade400,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Título Medições
            Text(
              'Medições',
              style: TextStyle(
                fontSize: 15,
                color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            // Peso Corporal Input
            _buildInputRow(
              title: 'Peso Corporal (kg)',
              controller: _weightController,
              placeholder: '83',
              isDark: isDark,
            ),
            const Divider(),

            // Cintura Input
            _buildInputRow(
              title: 'Cintura (cm)',
              controller: _waistController,
              placeholder: '-',
              isDark: isDark,
            ),
            const Divider(),

            // Itens PRO Bloqueados
            _buildLockedRow('Gordura Corporal (%)', isDark),
            const Divider(),
            _buildLockedRow('Massa corporal magra (kg)', isDark),
            const Divider(),
            _buildLockedRow('Pescoço (cm)', isDark),
            const Divider(),
            _buildLockedRow('Ombro (cm)', isDark),
            const Divider(),
            _buildLockedRow('Peito (cm)', isDark),
            const Divider(),
            _buildLockedRow('Bíceps Esquerdo (cm)', isDark),
            const Divider(),
            _buildLockedRow('Bíceps Direito (cm)', isDark),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildInputRow({
    required String title,
    required TextEditingController controller,
    required String placeholder,
    required bool isDark,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),
          SizedBox(
            width: 80,
            child: TextField(
              controller: controller,
              textAlign: TextAlign.end,
              keyboardType: TextInputType.number,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black87,
              ),
              decoration: InputDecoration(
                hintText: placeholder,
                hintStyle: const TextStyle(color: Colors.grey),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLockedRow(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white60 : Colors.black54,
            ),
          ),
          Icon(Icons.lock, color: isDark ? Colors.grey.shade700 : Colors.grey.shade400, size: 18),
        ],
      ),
    );
  }
}
