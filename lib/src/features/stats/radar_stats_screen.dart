import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class RadarStatsScreen extends StatelessWidget {
  const RadarStatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Distribuição muscular',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        actions: [
          Icon(Icons.help_outline, color: isDark ? Colors.white60 : Colors.black54),
          const SizedBox(width: 12),
          Icon(Icons.ios_share, color: isDark ? Colors.white60 : Colors.black54),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Seletor de período
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E1E) : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Últimos 30 dias',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.keyboard_arrow_down, size: 18),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Radar/Spider Chart
            SizedBox(
              height: 240,
              child: RadarChart(
                RadarChartData(
                  dataSets: [
                    // DataSet Atual (Azul vibrante)
                    RadarDataSet(
                      fillColor: Colors.blue.withOpacity(0.25),
                      borderColor: Colors.blue,
                      entryRadius: 3,
                      borderWidth: 2,
                      dataEntries: const [
                        RadarEntry(value: 30), // Costas
                        RadarEntry(value: 10), // Peito
                        RadarEntry(value: 15), // Core
                        RadarEntry(value: 12), // Ombros
                        RadarEntry(value: 18), // Braços
                        RadarEntry(value: 80), // Pernas (Predominante como no print)
                      ],
                    ),
                    // DataSet Anterior (Cinza escuro)
                    RadarDataSet(
                      fillColor: Colors.grey.withOpacity(0.08),
                      borderColor: Colors.grey.shade500,
                      entryRadius: 2,
                      borderWidth: 1.5,
                      dataEntries: const [
                        RadarEntry(value: 15), // Costas
                        RadarEntry(value: 8),  // Peito
                        RadarEntry(value: 10), // Core
                        RadarEntry(value: 6),  // Ombros
                        RadarEntry(value: 10), // Braços
                        RadarEntry(value: 40), // Pernas
                      ],
                    ),
                  ],
                  radarBackgroundColor: Colors.transparent,
                  radarBorderData: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300, width: 1),
                  gridBorderData: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300, width: 1),
                  tickBorderData: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300, width: 1),
                  ticksTextStyle: const TextStyle(color: Colors.transparent),
                  titlePositionPercentageOffset: 0.15,
                  titleTextStyle: TextStyle(
                    color: isDark ? Colors.white60 : Colors.black54,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                  getTitle: (index, angle) {
                    final titles = ['Costas', 'Peito', 'Core', 'Ombros', 'Braços', 'Pernas'];
                    return RadarChartTitle(
                      text: titles[index],
                      angle: angle,
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Legenda
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildLegendItem('Atual', Colors.blue),
                const SizedBox(width: 24),
                _buildLegendItem('Anterior', Colors.grey),
              ],
            ),
            const SizedBox(height: 40),

            // Grid 2x2 com os Cartões de Progresso
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.45,
              children: [
                _buildProgressCard('Treinamentos', '2', '+ 2', isDark),
                _buildProgressCard('Duração', '2min', '+ 2min', isDark),
                _buildProgressCard('Volume', '330 kg', '+ 330 kg', isDark),
                _buildProgressCard('Séries', '6', '+ 6', isDark),
              ],
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildLegendItem(String text, Color color) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          text,
          style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget _buildProgressCard(String title, String mainVal, String changeVal, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isDark ? Colors.grey.shade400 : Colors.black54,
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                mainVal,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.arrow_upward, color: Colors.green, size: 14),
                  const SizedBox(width: 2),
                  Text(
                    changeVal,
                    style: const TextStyle(
                      color: Colors.green,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
