import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/exercise_mock.dart';
import 'exercise_detail_screen.dart';

final selectedExercisesProvider = StateProvider<Set<ExerciseMock>>((ref) => {});
final equipmentFilterProvider = StateProvider<String>((ref) => 'Todo o Equipamento');
final muscleFilterProvider = StateProvider<String>((ref) => 'Todos os Músculos');

class AddExerciseScreen extends ConsumerWidget {
  const AddExerciseScreen({super.key});

  void _showEquipmentFilter(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade700, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            const Text('Tipo de Categoria', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildEquipTile(context, ref, 'Todo o Equipamento', Icons.grid_view),
            _buildEquipTile(context, ref, 'Barra', Icons.fitness_center),
            _buildEquipTile(context, ref, 'Halteres', Icons.fitness_center),
            _buildEquipTile(context, ref, 'Peso Corporal', Icons.accessibility_new),
          ],
        ),
      ),
    );
  }

  Widget _buildEquipTile(BuildContext context, WidgetRef ref, String title, IconData icon) {
    final current = ref.watch(equipmentFilterProvider);
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      trailing: current == title ? const Icon(Icons.check, color: Colors.blue) : null,
      onTap: () {
        ref.read(equipmentFilterProvider.notifier).state = title;
        Navigator.pop(context);
      },
    );
  }

  void _showMuscleFilter(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade700, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            const Text('Grupo Muscular', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildMuscleTile(context, ref, 'Todos os Músculos', Icons.grid_view),
            _buildMuscleTile(context, ref, 'Peito', Icons.accessibility),
            _buildMuscleTile(context, ref, 'Costas', Icons.accessibility),
            _buildMuscleTile(context, ref, 'Pernas', Icons.accessibility),
            _buildMuscleTile(context, ref, 'Braços', Icons.accessibility),
            _buildMuscleTile(context, ref, 'Abdômen', Icons.accessibility),
          ],
        ),
      ),
    );
  }

  Widget _buildMuscleTile(BuildContext context, WidgetRef ref, String title, IconData icon) {
    final current = ref.watch(muscleFilterProvider);
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      trailing: current == title ? const Icon(Icons.check, color: Colors.blue) : null,
      onTap: () {
        ref.read(muscleFilterProvider.notifier).state = title;
        Navigator.pop(context);
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedExercises = ref.watch(selectedExercisesProvider);
    final eqFilter = ref.watch(equipmentFilterProvider);
    final msFilter = ref.watch(muscleFilterProvider);

    final filteredExercises = mockExercises.where((ex) {
      final matchEq = eqFilter == 'Todo o Equipamento' || ex.equipment == eqFilter;
      final matchMs = msFilter == 'Todos os Músculos' || ex.primaryMuscle == msFilter;
      return matchEq && matchMs;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Adicionar Exercício'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Criar'),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Procurar exercício',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showEquipmentFilter(context, ref),
                    icon: const Icon(Icons.grid_view, size: 18),
                    label: Text(eqFilter),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.surface,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showMuscleFilter(context, ref),
                    icon: const Icon(Icons.accessibility_new, size: 18),
                    label: Text(msFilter),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.surface,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.separated(
              itemCount: filteredExercises.length,
              separatorBuilder: (context, index) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final exercise = filteredExercises[index];
                final isSelected = selectedExercises.contains(exercise);

                return ListTile(
                  onTap: () {
                    final newSet = Set<ExerciseMock>.from(selectedExercises);
                    if (isSelected) {
                      newSet.remove(exercise);
                    } else {
                      newSet.add(exercise);
                    }
                    ref.read(selectedExercisesProvider.notifier).state = newSet;
                  },
                  leading: Container(
                    decoration: BoxDecoration(
                      border: isSelected ? const Border(left: BorderSide(color: Colors.blue, width: 4)) : null,
                    ),
                    padding: EdgeInsets.only(left: isSelected ? 4 : 8),
                    child: CircleAvatar(
                      backgroundImage: NetworkImage(exercise.imageUrl),
                      backgroundColor: Colors.transparent,
                    ),
                  ),
                  title: Text(exercise.name),
                  subtitle: Text(exercise.primaryMuscle),
                  trailing: IconButton(
                    icon: const Icon(Icons.show_chart),
                    color: Theme.of(context).primaryColor,
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ExerciseDetailScreen(exercise: exercise),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
          if (selectedExercises.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              width: double.infinity,
              color: Theme.of(context).scaffoldBackgroundColor,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context, selectedExercises.toList());
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Adicionar ${selectedExercises.length} exercícios'),
              ),
            ),
        ],
      ),
    );
  }
}
