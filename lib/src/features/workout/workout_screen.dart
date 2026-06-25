import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'active_workout_screen.dart';
import 'new_routine_screen.dart';
import 'providers/workout_provider.dart';
import 'providers/routine_provider.dart';
import 'models/exercise_mock.dart';
import 'models/workout_session.dart';

// Provedor para gerenciar a lista de pastas criadas pelo usuário
final foldersProvider = StateProvider<List<String>>((ref) => []);

class WorkoutScreen extends ConsumerWidget {
  const WorkoutScreen({super.key});

  void _showNewFolderDialog(BuildContext context, WidgetRef ref) {
    final TextEditingController folderNameController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Center(child: Text('Criar Nova Pasta', style: TextStyle(fontWeight: FontWeight.bold))),
          content: TextField(
            controller: folderNameController,
            decoration: InputDecoration(
              hintText: 'Nova Pasta',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
            ),
          ),
          actions: [
            SizedBox(
              width: double.infinity,
              height: 45,
              child: ElevatedButton(
                onPressed: () {
                  if (folderNameController.text.trim().isNotEmpty) {
                    ref.read(foldersProvider.notifier).state = [
                      ...ref.read(foldersProvider),
                      folderNameController.text.trim(),
                    ];
                  }
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('Salvar'),
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 45,
              child: TextButton(
                onPressed: () => Navigator.pop(context),
                style: TextButton.styleFrom(
                  backgroundColor: Colors.grey.shade200,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('Cancelar'),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final folders = ref.watch(foldersProvider);
    final routines = ref.watch(routinesProvider);

    final noFolderRoutines = routines.where((r) => r.folderName == null).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Treino', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Start Empty Workout Button
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton.icon(
                onPressed: () {
                  // Garante que o treino ativo comece limpo
                  ref.read(workoutProvider.notifier).clearWorkout();
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ActiveWorkoutScreen()),
                  );
                },
                icon: const Icon(Icons.add, size: 24),
                label: const Text('Iniciar Treinamento Vazio', style: TextStyle(fontSize: 16)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.surface,
                  foregroundColor: Colors.white,
                  alignment: Alignment.centerLeft,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                ),
              ),
            ),
            const SizedBox(height: 32),
            
            // Routines Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Rotinas', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.create_new_folder_outlined), 
                  onPressed: () => _showNewFolderDialog(context, ref),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Routine Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const NewRoutineScreen()),
                      );
                    },
                    icon: const Icon(Icons.assignment_outlined),
                    label: const Text('Nova Rotina'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.surface,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.search),
                    label: const Text('Explorar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.surface,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Pastas Dinâmicas (Criadas pelo usuário)
            ...folders.map((folderName) {
              final routinesInFolder = routines.where((r) => r.folderName == folderName).toList();
              return _buildFolderSection(context, ref, folderName, routinesInFolder);
            }).toList(),

            // My Routines List (Dinamizada)
            Row(
              children: [
                const Icon(Icons.arrow_drop_down, color: Colors.grey),
                Text('Minhas Rotinas (${noFolderRoutines.length})', style: TextStyle(color: Colors.grey.shade400)),
              ],
            ),
            const SizedBox(height: 16),

            if (noFolderRoutines.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Text('Nenhuma rotina fora de pastas.', style: TextStyle(color: Colors.grey.shade600, fontStyle: FontStyle.italic)),
              )
            else
              ...noFolderRoutines.map((routine) => _buildRoutineCard(context, ref, routine)).toList(),
          ],
        ),
      ),
    );
  }

  // Método auxiliar para desenhar a UI da pasta com suporte a suas rotinas
  Widget _buildFolderSection(BuildContext context, WidgetRef ref, String folderName, List<Routine> routinesInFolder) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(Icons.arrow_drop_down, color: Colors.grey),
                Text(folderName, style: TextStyle(color: Colors.grey.shade400, fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            PopupMenuButton<String>(
              icon: const Icon(Icons.more_horiz, color: Colors.grey),
              onSelected: (val) {
                if (val == 'delete') {
                  ref.read(foldersProvider.notifier).state = 
                      ref.read(foldersProvider).where((f) => f != folderName).toList();
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'delete',
                  child: Text('Excluir Pasta', style: TextStyle(color: Colors.redAccent)),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (routinesInFolder.isEmpty)
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => NewRoutineScreen(folderName: folderName)),
              );
            },
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade700, width: 1.5, style: BorderStyle.solid),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.add, color: Colors.blue, size: 20),
                  SizedBox(width: 8),
                  Text('Adicionar nova rotina', style: TextStyle(color: Colors.blue, fontSize: 16, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
          )
        else
          Column(
            children: [
              ...routinesInFolder.map((routine) => _buildRoutineCard(context, ref, routine)).toList(),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => NewRoutineScreen(folderName: folderName)),
                    );
                  },
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Nova Rotina na pasta'),
                ),
              ),
            ],
          ),
        const SizedBox(height: 32),
      ],
    );
  }

  // Método auxiliar para desenhar o Card de uma rotina
  Widget _buildRoutineCard(BuildContext context, WidgetRef ref, Routine routine) {
    final String exerciseListText = routine.exercises.map((e) => e.exercise.name).join(', ');

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(routine.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_horiz, color: Colors.grey),
                onSelected: (val) {
                  if (val == 'delete') {
                    ref.read(routinesProvider.notifier).removeRoutine(routine.id);
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'delete',
                    child: Text('Excluir Rotina', style: TextStyle(color: Colors.redAccent)),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            exerciseListText.isNotEmpty ? exerciseListText : 'Nenhum exercício selecionado',
            style: TextStyle(color: Colors.grey.shade400),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 45,
            child: ElevatedButton(
              onPressed: () {
                // Limpa qualquer treino pendente
                ref.read(workoutProvider.notifier).clearWorkout();
                
                // Carrega os exercícios e séries da rotina no treino ativo
                ref.read(workoutProvider.notifier).loadExercisesWithSets(routine.exercises);

                // Abre o treino
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ActiveWorkoutScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              child: const Text('Iniciar Rotina'),
            ),
          ),
        ],
      ),
    );
  }
}
