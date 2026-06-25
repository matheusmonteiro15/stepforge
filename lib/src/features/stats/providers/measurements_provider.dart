import 'package:flutter_riverpod/flutter_riverpod.dart';

class Measurement {
  final String id;
  final DateTime date;
  final double weight;
  final double? waist;
  final String? imageUrl;

  Measurement({
    required this.id,
    required this.date,
    required this.weight,
    this.waist,
    this.imageUrl,
  });
}

final measurementsProvider = StateNotifierProvider<MeasurementsNotifier, List<Measurement>>((ref) {
  return MeasurementsNotifier();
});

class MeasurementsNotifier extends StateNotifier<List<Measurement>> {
  MeasurementsNotifier() : super([
    // Registro padrão que aparece no print: 83kg em 6 de Maio
    Measurement(
      id: 'default-1',
      date: DateTime(2026, 5, 6),
      weight: 83.0,
      waist: 78.0,
    ),
  ]);

  void addMeasurement(double weight, {double? waist, String? imageUrl}) {
    final newMeasurement = Measurement(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: DateTime.now(),
      weight: weight,
      waist: waist,
      imageUrl: imageUrl,
    );
    // Ordena por data decrescente
    state = [newMeasurement, ...state]..sort((a, b) => b.date.compareTo(a.date));
  }
}
