import 'exercise_mock.dart';

class WorkoutSet {
  final String id;
  final String previous;
  double? weight;
  int? reps;
  bool isCompleted;

  WorkoutSet({
    required this.id,
    required this.previous,
    this.weight,
    this.reps,
    this.isCompleted = false,
  });
}

class WorkoutExercise {
  final ExerciseMock exercise;
  final List<WorkoutSet> sets;
  String? notes;

  WorkoutExercise({
    required this.exercise,
    required this.sets,
    this.notes,
  });
}

class Routine {
  final String id;
  final String name;
  final List<WorkoutExercise> exercises;
  final String? folderName;

  Routine({
    required this.id,
    required this.name,
    required this.exercises,
    this.folderName,
  });
}
