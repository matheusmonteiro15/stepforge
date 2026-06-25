import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'add_exercise_screen.dart';
import 'models/workout_session.dart';
import 'models/exercise_mock.dart';
import 'providers/routine_provider.dart';

class NewRoutineScreen extends ConsumerStatefulWidget {
  final String? folderName;
  const NewRoutineScreen({super.key, this.folderName});

  @override
  ConsumerState<NewRoutineScreen> createState() => _NewRoutineScreenState();
}

class _NewRoutineScreenState extends ConsumerState<NewRoutineScreen> {
  final TextEditingController _titleController = TextEditingController();
  final List<WorkoutExercise> _exercises = [];

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  void _addExercisesFromSelection(List<ExerciseMock> selected) {
    setState(() {
      for (final ex in selected) {
        // Evita adicionar duplicados
        if (!_exercises.any((e) => e.exercise.id == ex.id)) {
          _exercises.add(
            WorkoutExercise(
              exercise: ex,
              sets: [
                WorkoutSet(
                  id: DateTime.now().millisecondsSinceEpoch.toString() + ex.id,
                  previous: '',
                  weight: 0,
                  reps: 0,
                ),
              ],
            ),
          );
        }
      }
    });
  }

  void _addSet(int exerciseIndex) {
    setState(() {
      _exercises[exerciseIndex].sets.add(
        WorkoutSet(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          previous: '',
          weight: 0,
          reps: 0,
        ),
      );
    });
  }

  void _removeSet(int exerciseIndex, int setIndex) {
    setState(() {
      _exercises[exerciseIndex].sets.removeAt(setIndex);
    });
  }

  void _removeExercise(int exerciseIndex) {
    setState(() {
      _exercises.removeAt(exerciseIndex);
    });
  }

  void _saveRoutine() {
    if (_titleController.text.trim().isEmpty || _exercises.isEmpty) return;

    final routine = Routine(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: _titleController.text.trim(),
      exercises: _exercises,
      folderName: widget.folderName,
    );

    ref.read(routinesProvider.notifier).addRoutine(routine);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final bool canSave = _titleController.text.trim().isNotEmpty && _exercises.isNotEmpty;

    return Scaffold(
      backgroundColor: Colors.white, // Fundo claro conforme solicitado
      appBar: AppBar(
        leading: TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancelar', style: TextStyle(color: Colors.blue, fontSize: 16)),
        ),
        leadingWidth: 90,
        title: const Text('Criar Rotina', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0, top: 8, bottom: 8),
            child: ElevatedButton(
              onPressed: canSave ? _saveRoutine : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: canSave ? Colors.blue : Colors.grey.shade300,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                elevation: 0,
              ),
              child: const Text('Salvar'),
            ),
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: TextField(
              controller: _titleController,
              onChanged: (_) => setState(() {}),
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black),
              decoration: const InputDecoration(
                hintText: 'Título da rotina',
                hintStyle: TextStyle(color: Colors.grey),
                border: InputBorder.none,
              ),
            ),
          ),
          const Divider(),
          Expanded(
            child: _exercises.isEmpty
                ? _buildEmptyState()
                : _buildExercisesList(),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.fitness_center, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            const Text(
              'Comece por adicionar um exercício à sua\nrotina.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 16),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _navigateToAddExercise,
                icon: const Icon(Icons.add),
                label: const Text('Adicionar exercício'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExercisesList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _exercises.length + 1,
      itemBuilder: (context, index) {
        if (index == _exercises.length) {
          return Padding(
            padding: const EdgeInsets.only(top: 16.0, bottom: 40.0),
            child: SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton.icon(
                onPressed: _navigateToAddExercise,
                icon: const Icon(Icons.add, color: Colors.blue),
                label: const Text('Adicionar Exercício', style: TextStyle(color: Colors.blue, fontSize: 16)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.blue),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          );
        }

        final workoutEx = _exercises[index];
        return _buildExerciseCard(workoutEx, index);
      },
    );
  }

  Widget _buildExerciseCard(WorkoutExercise workoutEx, int exerciseIndex) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      color: Colors.grey.shade50,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(workoutEx.exercise.imageUrl),
                  backgroundColor: Colors.transparent,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    workoutEx.exercise.name,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue),
                  ),
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_vert, color: Colors.grey),
                  onSelected: (val) {
                    if (val == 'remove') {
                      _removeExercise(exerciseIndex);
                    }
                  },
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'remove',
                      child: Text('Remover Exercício', style: TextStyle(color: Colors.redAccent)),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Tabela de Séries
            Row(
              children: [
                const SizedBox(width: 50, child: Text('SÉRIE', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))),
                const Expanded(flex: 2, child: Text('KG', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))),
                const Expanded(flex: 2, child: Text('REPS', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))),
                const SizedBox(width: 40), // Espaço para botão excluir
              ],
            ),
            const Divider(),
            ...workoutEx.sets.asMap().entries.map((entry) {
              final setIndex = entry.key;
              final set = entry.value;

              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 6.0),
                child: Row(
                  children: [
                    SizedBox(
                      width: 50,
                      child: Text('${setIndex + 1}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
                    ),
                    Expanded(
                      flex: 2,
                      child: Container(
                        height: 35,
                        margin: const EdgeInsets.only(right: 12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: TextField(
                          textAlign: TextAlign.center,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14, color: Colors.black),
                          decoration: const InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.only(bottom: 12)),
                          onChanged: (val) {
                            set.weight = double.tryParse(val) ?? 0;
                          },
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 2,
                      child: Container(
                        height: 35,
                        margin: const EdgeInsets.only(right: 12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: TextField(
                          textAlign: TextAlign.center,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 14, color: Colors.black),
                          decoration: const InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.only(bottom: 12)),
                          onChanged: (val) {
                            set.reps = int.tryParse(val) ?? 0;
                          },
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.grey, size: 18),
                      onPressed: () => _removeSet(exerciseIndex, setIndex),
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 35,
              child: TextButton.icon(
                onPressed: () => _addSet(exerciseIndex),
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Adicionar Série', style: TextStyle(fontSize: 14)),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.blue,
                  padding: EdgeInsets.zero,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _navigateToAddExercise() async {
    // Limpa a seleção anterior do provider antes de abrir a tela de adicionar
    ref.read(selectedExercisesProvider.notifier).state = {};

    final result = await Navigator.push<List<ExerciseMock>>(
      context,
      MaterialPageRoute(builder: (context) => const AddExerciseScreen()),
    );

    if (result != null && result.isNotEmpty) {
      _addExercisesFromSelection(result);
    }
  }
}
