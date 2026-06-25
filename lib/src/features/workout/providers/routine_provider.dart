import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/workout_session.dart';
import '../models/exercise_mock.dart';

final routinesProvider = StateNotifierProvider<RoutinesNotifier, List<Routine>>((ref) {
  return RoutinesNotifier();
});

class RoutinesNotifier extends StateNotifier<List<Routine>> {
  RoutinesNotifier() : super([
    // Rotina padrão de Perna
    Routine(
      id: 'default-perna',
      name: 'Perna',
      exercises: [
        WorkoutExercise(
          exercise: mockExercises.firstWhere((e) => e.name.contains('Agachamento')),
          sets: [
            WorkoutSet(id: '1', previous: '', weight: 40, reps: 10),
            WorkoutSet(id: '2', previous: '', weight: 45, reps: 8),
          ],
        ),
        WorkoutExercise(
          exercise: mockExercises.firstWhere((e) => e.name.contains('Remada')),
          sets: [
            WorkoutSet(id: '3', previous: '', weight: 30, reps: 12),
          ],
        ),
      ],
    )
  ]);

  void addRoutine(Routine routine) {
    state = [...state, routine];
  }

  void removeRoutine(String id) {
    state = state.where((r) => r.id != id).toList();
  }
}
