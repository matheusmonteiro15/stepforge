import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'providers/measurements_provider.dart';
import 'add_measurement_screen.dart';

class MeasurementsScreen extends ConsumerWidget {
  const MeasurementsScreen({super.key});

  String _getMonthName(int month) {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    if (month >= 1 && month <= 12) {
      return months[month - 1];
    }
    return '';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    final measurements = ref.watch(measurementsProvider);

    // Dados de peso mais recente
    final latestWeightText = measurements.isNotEmpty ? '${measurements.first.weight.toStringAsFixed(0)}kg' : '-- kg';
    final latestDateText = measurements.isNotEmpty
        ? '${_getMonthName(measurements.first.date.month)} ${measurements.first.date.day}'
        : '';

    // Converte medições para spots do gráfico
    // Se só houver uma medição, colocamos um ponto fictício anterior para o gráfico ficar bonito
    List<FlSpot> spots = [];
    if (measurements.length == 1) {
      spots = [
        FlSpot(0, measurements[0].weight - 0.5),
        FlSpot(1, measurements[0].weight),
      ];
    } else {
      // Ordena por data antiga primeiro para desenhar da esquerda para a direita
      final sortedList = List<Measurement>.from(measurements)..sort((a, b) => a.date.compareTo(b.date));
      for (int i = 0; i < sortedList.length; i++) {
        spots.add(FlSpot(i.toDouble(), sortedList[i].weight));
      }
    }

    // Calcula minY e maxY para dar margem
    double minY = 70;
    double maxY = 90;
    if (measurements.isNotEmpty) {
      final weights = measurements.map((m) => m.weight).toList();
      weights.sort();
      minY = weights.first - 2;
      maxY = weights.last + 2;
    }

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Medições',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(Icons.add, color: isDark ? Colors.white : Colors.black),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AddMeasurementScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Row do peso mais recente e do período
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      latestWeightText,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      latestDateText,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.blue,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                DropdownButton<String>(
                  value: '3m',
                  underline: const SizedBox(),
                  icon: const Icon(Icons.keyboard_arrow_down, color: Colors.blue),
                  style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                  onChanged: (_) {},
                  items: const [
                    DropdownMenuItem(value: '3m', child: Text('Últimos 3 meses')),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Gráfico de Tendência de Peso
            if (spots.isNotEmpty)
              SizedBox(
                height: 180,
                child: LineChart(
                  LineChartData(
                    gridData: const FlGridData(show: false),
                    titlesData: FlTitlesData(
                      show: true,
                      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (val, meta) {
                            return Text(
                              '${val.toStringAsFixed(1)}kg',
                              style: const TextStyle(color: Colors.grey, fontSize: 10),
                            );
                          },
                          reservedSize: 45,
                        ),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (val, meta) {
                            if (measurements.length == 1) {
                              if (val == 0) return const SizedBox();
                              return Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Text(latestDateText, style: const TextStyle(color: Colors.grey, fontSize: 10)),
                              );
                            }
                            // Mostra data formatada para cada spot
                            int idx = val.toInt();
                            final sorted = List<Measurement>.from(measurements)..sort((a, b) => a.date.compareTo(b.date));
                            if (idx >= 0 && idx < sorted.length) {
                              final d = sorted[idx].date;
                              return Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Text('${_getMonthName(d.month)} ${d.day}', style: const TextStyle(color: Colors.grey, fontSize: 10)),
                              );
                            }
                            return const SizedBox();
                          },
                          reservedSize: 24,
                        ),
                      ),
                    ),
                    borderData: FlBorderData(show: false),
                    minX: 0,
                    maxX: spots.length == 1 ? 1 : (spots.length - 1).toDouble(),
                    minY: minY,
                    maxY: maxY,
                    lineBarsData: [
                      LineChartBarData(
                        spots: spots,
                        isCurved: true,
                        color: Colors.blue,
                        barWidth: 3,
                        isStrokeCapRound: true,
                        dotData: const FlDotData(show: true),
                        belowBarData: BarAreaData(
                          show: true,
                          color: Colors.blue.withOpacity(0.08),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 24),

            // Tab Pill "Peso"
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Peso',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Histórico de Peso
            Text(
              'Histórico de Peso',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white60 : Colors.black54,
              ),
            ),
            const SizedBox(height: 12),

            // Lista de Histórico
            if (measurements.isEmpty)
              const Center(child: Text('Nenhuma medição registrada.', style: TextStyle(color: Colors.grey)))
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: measurements.length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final m = measurements[index];
                  final dateText = '${_getMonthName(m.date.month)} ${m.date.day}';
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          dateText,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.white : Colors.black87,
                          ),
                        ),
                        Text(
                          '${m.weight.toStringAsFixed(1)}kg',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.white : Colors.black87,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
