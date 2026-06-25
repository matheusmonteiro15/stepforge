import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'add_exercise_screen.dart';
import 'providers/workout_provider.dart';
import 'save_workout_screen.dart';
import 'models/workout_session.dart';

class ActiveWorkoutScreen extends ConsumerWidget {
  const ActiveWorkoutScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final workoutList = ref.watch(workoutProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Treinamento'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.timer_outlined), onPressed: () {}),
          Padding(
            padding: const EdgeInsets.only(right: 16.0, top: 8, bottom: 8),
            child: ElevatedButton(
              onPressed: () {
                if (ref.read(workoutProvider.notifier).canFinishWorkout()) {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const SaveWorkoutScreen()),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Conclua pelo menos uma série para finalizar o treino!'),
                      backgroundColor: Colors.redAccent,
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Concluir'),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Stats Header
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatColumn('Duração', '2min 12s', Colors.blue),
                _buildStatColumn('Volume', '0 kg', Colors.white),
                _buildStatColumn('Séries', '0', Colors.white),
                const Icon(Icons.accessibility_new, size: 32, color: Colors.grey),
              ],
            ),
          ),
          const Divider(),

          // Body
          Expanded(
            child: workoutList.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.fitness_center, size: 64, color: Colors.grey),
                        const SizedBox(height: 16),
                        Text(
                          'Começar',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Adicione um exercício para começar seu\ntreinamento',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: workoutList.length + 1, // +1 para o botão de adicionar no final
                    itemBuilder: (context, index) {
                      if (index == workoutList.length) {
                        return Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              SizedBox(
                                width: double.infinity,
                                height: 50,
                                child: TextButton.icon(
                                  onPressed: () async {
                                    final result = await Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (context) => const AddExerciseScreen()),
                                    );
                                    if (result != null && result is List) {
                                      ref.read(workoutProvider.notifier).addExercises(result.cast());
                                    }
                                  },
                                  icon: const Icon(Icons.add),
                                  label: const Text('Adicionar Exercício'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.blue,
                                    backgroundColor: Theme.of(context).colorScheme.surface,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              SizedBox(
                                width: double.infinity,
                                height: 50,
                                child: TextButton(
                                  onPressed: () {
                                    showDialog(
                                      context: context,
                                      builder: (context) => AlertDialog(
                                        title: const Text('Descartar Treino'),
                                        content: const Text('Tem certeza que deseja descartar este treino? Os dados não serão salvos.'),
                                        actions: [
                                          TextButton(
                                            onPressed: () => Navigator.pop(context),
                                            child: const Text('Cancelar', style: TextStyle(color: Colors.white)),
                                          ),
                                          TextButton(
                                            onPressed: () {
                                              ref.read(workoutProvider.notifier).clearWorkout();
                                              Navigator.pop(context); // Fecha dialog
                                              Navigator.pop(context); // Fecha treino
                                            },
                                            style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
                                            child: const Text('Descartar'),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                  style: TextButton.styleFrom(
                                    backgroundColor: Theme.of(context).colorScheme.surface,
                                    foregroundColor: Colors.redAccent,
                                  ),
                                  child: const Text('Descartar Treino'),
                                ),
                              ),
                            ],
                          ),
                        );
                      }

                      return _buildExerciseCard(context, ref, workoutList[index], index);
                    },
                  ),
          ),
          
          if (workoutList.isEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    final result = await Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const AddExerciseScreen()),
                    );
                    if (result != null && result is List) {
                      ref.read(workoutProvider.notifier).addExercises(result.cast());
                    }
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Adicionar Exercício'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildExerciseCard(BuildContext context, WidgetRef ref, WorkoutExercise workoutExercise, int exerciseIndex) {
    return Container(
      color: Theme.of(context).colorScheme.surface,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(workoutExercise.exercise.imageUrl),
                  backgroundColor: Colors.transparent,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    workoutExercise.exercise.name,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue),
                  ),
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_vert),
                  onSelected: (value) {
                    if (value == 'remove') {
                      ref.read(workoutProvider.notifier).removeExercise(exerciseIndex);
                    }
                  },
                  itemBuilder: (BuildContext context) => [
                    const PopupMenuItem(
                      value: 'remove',
                      child: Text('Remover Exercício', style: TextStyle(color: Colors.redAccent)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Notes
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
            child: TextField(
              decoration: const InputDecoration(
                hintText: 'Adicionar notas aqui...',
                border: InputBorder.none,
                hintStyle: TextStyle(color: Colors.grey),
                isDense: true,
              ),
              style: const TextStyle(fontSize: 14),
            ),
          ),
          // Timer
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Icon(Icons.timer_outlined, color: Colors.blue, size: 16),
                const SizedBox(width: 4),
                Text('Descanso: 1min 0s', style: TextStyle(color: Colors.blue, fontSize: 14)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Table Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                const SizedBox(width: 40, child: Text('SÉRIE', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))),
                const Expanded(flex: 2, child: Text('ANTERIOR', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))),
                Expanded(flex: 1, child: Row(children: [const Icon(Icons.fitness_center, size: 12, color: Colors.grey), const SizedBox(width: 4), const Text('KG', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))])),
                const Expanded(flex: 1, child: Text('REPS', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold))),
                const SizedBox(width: 40, child: Icon(Icons.check, size: 16, color: Colors.grey)),
              ],
            ),
          ),
          const SizedBox(height: 8),
          // Sets List
          ...workoutExercise.sets.asMap().entries.map((entry) {
            final setIndex = entry.key;
            final set = entry.value;
            return Container(
              color: set.isCompleted ? Colors.green.withOpacity(0.2) : Colors.transparent,
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Row(
                children: [
                  SizedBox(
                    width: 40,
                    child: Text('${setIndex + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  Expanded(
                    flex: 2,
                    child: Text(set.previous, style: const TextStyle(color: Colors.grey)),
                  ),
                  Expanded(
                    flex: 1,
                    child: Container(
                      height: 30,
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade900,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: TextField(
                        textAlign: TextAlign.center,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(fontSize: 14),
                        decoration: const InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.only(bottom: 15)),
                        onChanged: (val) => ref.read(workoutProvider.notifier).updateSetValues(exerciseIndex, setIndex, weight: double.tryParse(val)),
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 1,
                    child: Container(
                      height: 30,
                      margin: const EdgeInsets.only(right: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade900,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: TextField(
                        textAlign: TextAlign.center,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(fontSize: 14),
                        decoration: const InputDecoration(border: InputBorder.none, contentPadding: EdgeInsets.only(bottom: 15)),
                        onChanged: (val) => ref.read(workoutProvider.notifier).updateSetValues(exerciseIndex, setIndex, reps: int.tryParse(val)),
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => ref.read(workoutProvider.notifier).toggleSetComplete(exerciseIndex, setIndex),
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        color: set.isCompleted ? Colors.green : Colors.grey.shade800,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Icon(Icons.check, color: Colors.white, size: 16),
                    ),
                  ),
                ],
              ),
            );
          }),
          // Add Set Button
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              height: 40,
              child: TextButton.icon(
                onPressed: () => ref.read(workoutProvider.notifier).addSet(exerciseIndex),
                icon: const Icon(Icons.add),
                label: const Text('Adicionar Série'),
                style: TextButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  foregroundColor: Colors.grey.shade300,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, Color valueColor) {
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
