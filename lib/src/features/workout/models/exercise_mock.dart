class ExerciseMock {
  final String id;
  final String name;
  final String primaryMuscle;
  final String equipment;
  final String imageUrl;

  ExerciseMock({
    required this.id,
    required this.name,
    required this.primaryMuscle,
    required this.equipment,
    required this.imageUrl,
  });
}

final mockExercises = [
  ExerciseMock(
    id: '1',
    name: 'Agachamento (Barra)',
    primaryMuscle: 'Pernas',
    equipment: 'Barra',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200',
  ),
  ExerciseMock(
    id: '2',
    name: 'Remadas Dobradas (Barra)',
    primaryMuscle: 'Costas',
    equipment: 'Barra',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200',
  ),
  ExerciseMock(
    id: '3',
    name: 'Rosca 21',
    primaryMuscle: 'Braços',
    equipment: 'Halteres',
    imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&q=80&w=200',
  ),
  ExerciseMock(
    id: '4',
    name: 'Supino Reto (Barra)',
    primaryMuscle: 'Peito',
    equipment: 'Barra',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
  ),
  ExerciseMock(
    id: '5',
    name: 'Abdominal Tesoura',
    primaryMuscle: 'Abdômen',
    equipment: 'Peso Corporal',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200',
  ),
];
