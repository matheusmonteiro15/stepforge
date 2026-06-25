import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/workout_session.dart';
import '../models/exercise_mock.dart';
final workoutProvider = StateNotifierProvider<WorkoutNotifier, List<WorkoutExercise>>((ref) {
  return WorkoutNotifier();
});

class WorkoutNotifier extends StateNotifier<List<WorkoutExercise>> {
  WorkoutNotifier() : super([]);

  void addExercises(List<ExerciseMock> exercises) {
    final newExercises = exercises.map((ex) => WorkoutExercise(
      exercise: ex,
      sets: [
        WorkoutSet(id: DateTime.now().millisecondsSinceEpoch.toString(), previous: '5kg x 10') 
      ],
    )).toList();
    
    state = [...state, ...newExercises];
  }

  void loadExercisesWithSets(List<WorkoutExercise> exercises) {
    state = exercises.map((we) => WorkoutExercise(
      exercise: we.exercise,
      sets: we.sets.map((s) => WorkoutSet(
        id: DateTime.now().millisecondsSinceEpoch.toString() + s.id,
        previous: s.weight != null && s.weight! > 0 ? '${s.weight}kg x ${s.reps}' : '5kg x 10',
        weight: s.weight == 0 ? null : s.weight,
        reps: s.reps == 0 ? null : s.reps,
        isCompleted: false,
      )).toList(),
      notes: we.notes,
    )).toList();
  }

  void removeExercise(int exerciseIndex) {
    final updatedState = [...state];
    updatedState.removeAt(exerciseIndex);
    state = updatedState;
  }

  void addSet(int exerciseIndex) {
    final updatedState = [...state];
    final currentExercise = updatedState[exerciseIndex];
    final newSet = WorkoutSet(id: DateTime.now().millisecondsSinceEpoch.toString(), previous: '6kg x 10');
    
    updatedState[exerciseIndex] = WorkoutExercise(
      exercise: currentExercise.exercise,
      sets: [...currentExercise.sets, newSet],
      notes: currentExercise.notes,
    );
    
    state = updatedState;
  }

  void toggleSetComplete(int exerciseIndex, int setIndex) {
    final updatedState = [...state];
    final currentExercise = updatedState[exerciseIndex];
    final currentSet = currentExercise.sets[setIndex];
    
    final updatedSets = [...currentExercise.sets];
    updatedSets[setIndex] = WorkoutSet(
      id: currentSet.id,
      previous: currentSet.previous,
      weight: currentSet.weight,
      reps: currentSet.reps,
      isCompleted: !currentSet.isCompleted,
    );
    
    updatedState[exerciseIndex] = WorkoutExercise(
      exercise: currentExercise.exercise,
      sets: updatedSets,
      notes: currentExercise.notes,
    );
    
    state = updatedState;
  }

  void updateSetValues(int exerciseIndex, int setIndex, {double? weight, int? reps}) {
    final updatedState = [...state];
    final currentExercise = updatedState[exerciseIndex];
    final currentSet = currentExercise.sets[setIndex];
    
    final updatedSets = [...currentExercise.sets];
    updatedSets[setIndex] = WorkoutSet(
      id: currentSet.id,
      previous: currentSet.previous,
      weight: weight ?? currentSet.weight,
      reps: reps ?? currentSet.reps,
      isCompleted: currentSet.isCompleted,
    );
    
    updatedState[exerciseIndex] = WorkoutExercise(
      exercise: currentExercise.exercise,
      sets: updatedSets,
      notes: currentExercise.notes,
    );
    
    state = updatedState;
  }

  bool canFinishWorkout() {
    for (final exercise in state) {
      if (exercise.sets.any((s) => s.isCompleted)) {
        return true;
      }
    }
    return false;
  }

  void clearWorkout() {
    state = [];
  }
}
