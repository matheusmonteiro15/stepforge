import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'models/exercise_mock.dart';

class ExerciseDetailScreen extends StatelessWidget {
  final ExerciseMock exercise;

  const ExerciseDetailScreen({super.key, required this.exercise});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(exercise.name),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.ios_share), onPressed: () {}),
          IconButton(icon: const Icon(Icons.more_horiz), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Abas falsas
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                _buildTab(context, 'Resumo', true),
                const SizedBox(width: 16),
                _buildTab(context, 'Histórico', false),
                const SizedBox(width: 16),
                _buildTab(context, 'Instruções', false),
              ],
            ),
          ),
          const Divider(),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Imagem Gigante
                  Container(
                    width: double.infinity,
                    height: 250,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(exercise.imageUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          exercise.name,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Primário: ${exercise.primaryMuscle}',
                          style: TextStyle(color: Colors.grey.shade400),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Icon(Icons.lightbulb_outline, color: Theme.of(context).primaryColor),
                            const SizedBox(width: 8),
                            const Text('Como registrar exercícios com barra'),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // Gráfico
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('6 kg Mai 6', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                            Row(
                              children: [
                                Text('Últimos 3 meses', style: TextStyle(color: Theme.of(context).primaryColor)),
                                Icon(Icons.keyboard_arrow_down, color: Theme.of(context).primaryColor),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          height: 200,
                          child: LineChart(
                            LineChartData(
                              gridData: FlGridData(show: true, drawVerticalLine: false),
                              titlesData: FlTitlesData(
                                rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                leftTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 40,
                                    getTitlesWidget: (value, meta) => Text('${value.toInt()} kg', style: const TextStyle(fontSize: 10)),
                                  ),
                                ),
                              ),
                              borderData: FlBorderData(show: false),
                              lineBarsData: [
                                LineChartBarData(
                                  spots: const [
                                    FlSpot(1, 5),
                                    FlSpot(2, 6),
                                    FlSpot(3, 8),
                                    FlSpot(4, 7),
                                    FlSpot(5, 6),
                                  ],
                                  isCurved: false,
                                  color: Theme.of(context).primaryColor,
                                  barWidth: 3,
                                  dotData: FlDotData(show: true),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).primaryColor),
                                child: const Text('Maior Peso'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextButton(
                                onPressed: () {},
                                style: TextButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.surface),
                                child: const Text('1 RM Máx', style: TextStyle(color: Colors.white)),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: () {
                              // Simulando adicionar e voltando 2 telas (Detalhes -> Lista -> Treino)
                              Navigator.pop(context);
                              Navigator.pop(context);
                            },
                            child: const Text('Adicionar exercício'),
                          ),
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(BuildContext context, String title, bool isActive) {
    return Column(
      children: [
        Text(
          title,
          style: TextStyle(
            color: isActive ? Theme.of(context).primaryColor : Colors.grey,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        if (isActive)
          Container(
            margin: const EdgeInsets.only(top: 8),
            height: 2,
            width: 40,
            color: Theme.of(context).primaryColor,
          ),
      ],
    );
  }
}
