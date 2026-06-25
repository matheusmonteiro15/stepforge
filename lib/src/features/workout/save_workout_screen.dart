import 'package:flutter/material.dart';
import 'workout_summary_screen.dart';

class SaveWorkoutScreen extends StatelessWidget {
  const SaveWorkoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Seguindo o print claro
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Salvar', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0, top: 8, bottom: 8),
            child: ElevatedButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const WorkoutSummaryScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Salvar'),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black),
              decoration: const InputDecoration(
                hintText: 'Teste',
                border: InputBorder.none,
                suffixIcon: Icon(Icons.cancel, color: Colors.grey, size: 20),
              ),
              controller: TextEditingController(text: 'Teste'),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStat('Duração', '0min', Colors.blue),
                _buildStat('Volume', '110 kg', Colors.black),
                _buildStat('Séries', '2', Colors.black),
              ],
            ),
            const SizedBox(height: 24),
            const Text('When', style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 4),
            const Text('6 Mai 2026, 10:32 PM', style: TextStyle(color: Colors.blue, fontSize: 16)),
            const SizedBox(height: 24),
            // Adicionar Foto
            Container(
              height: 100,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Container(
                    width: 100,
                    decoration: BoxDecoration(
                      border: Border(right: BorderSide(color: Colors.grey.shade300)),
                    ),
                    child: const Center(child: Icon(Icons.add_photo_alternate_outlined, color: Colors.black, size: 32)),
                  ),
                  const Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(left: 16.0),
                      child: Text('Adicionar uma foto/vídeo', style: TextStyle(color: Colors.black, fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Descrição', style: TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 8),
            TextField(
              maxLines: 3,
              style: const TextStyle(color: Colors.black),
              decoration: const InputDecoration(
                hintText: 'Como correu o treinamento? Coloque algumas\nnotas aqui...',
                hintStyle: TextStyle(color: Colors.grey),
                border: InputBorder.none,
              ),
            ),
            const Divider(),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Visibilidade', style: TextStyle(color: Colors.black, fontSize: 16)),
              trailing: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Todos', style: TextStyle(color: Colors.grey)),
                  Icon(Icons.chevron_right, color: Colors.grey),
                ],
              ),
              onTap: () {},
            ),
            const SizedBox(height: 32),
            Center(
              child: TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
                child: const Text('Descartar Treinamento'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value, Color valueColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(color: valueColor, fontWeight: FontWeight.bold, fontSize: 16)),
      ],
    );
  }
}
