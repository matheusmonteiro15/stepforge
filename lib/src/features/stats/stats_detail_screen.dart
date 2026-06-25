import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'radar_stats_screen.dart';

class StatsDetailScreen extends ConsumerWidget {
  const StatsDetailScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121212) : Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Estatísticas',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Última semana de treinos
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Última semana de treinos',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                Icon(Icons.help_outline, color: Colors.grey.shade400, size: 20),
              ],
            ),
            const SizedBox(height: 16),

            // Dias da semana
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildDayChip('T', '19', false, isDark),
                _buildDayChip('Q', '20', false, isDark),
                _buildDayChip('Q', '21', false, isDark),
                _buildDayChip('S', '22', false, isDark),
                _buildDayChip('S', '23', false, isDark),
                _buildDayChip('D', '24', false, isDark),
                _buildDayChip('S', '25', true, isDark), // Ativo com pontinho azul
              ],
            ),
            const SizedBox(height: 32),

            // Desenho do Mapa de Calor Corporal (Abstract Human Silhouette Painter)
            Center(
              child: Container(
                height: 220,
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: CustomPaint(
                  painter: MuscleHeatmapPainter(isDark: isDark),
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Cabeçalho Estatísticas Avançadas
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Text(
                'Estatísticas avançadas',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white60 : Colors.black54,
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Sets por grupo muscular (Item 1)
            Theme(
              data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
              child: ExpansionTile(
                tilePadding: const EdgeInsets.symmetric(horizontal: 4),
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.analytics_outlined, color: Colors.blue),
                ),
                title: Row(
                  children: [
                    Text(
                      'Sets por grupo muscular',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade700,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'PRO',
                        style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                subtitle: Text(
                  'Número de séries registadas para cada grupo muscular.',
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      children: [
                        _buildMuscleBar('Pernas', 6, 8, Colors.blue),
                        _buildMuscleBar('Costas', 3, 8, Colors.blue.shade300),
                        _buildMuscleBar('Peito', 2, 8, Colors.blue.shade100),
                        _buildMuscleBar('Core', 1, 8, Colors.grey.shade400),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Divider(),

            // Distribuição muscular (Gráfico) (Item 2)
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const RadarStatsScreen()),
                );
              },
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.radar, color: Colors.blue),
              ),
              title: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Distribuição muscular (Gráfico)',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                  Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey.shade400),
                ],
              ),
              subtitle: const Text(
                'Compare as suas distribuições musculares atuais e anteriores.',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
            ),
            const Divider(),
          ],
        ),
      ),
    );
  }

  Widget _buildDayChip(String weekday, String dayNum, bool isActive, bool isDark) {
    return Container(
      width: 44,
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.grey.shade100,
        borderRadius: BorderRadius.circular(8),
        border: isActive ? Border.all(color: Colors.blue, width: 1.5) : null,
      ),
      child: Column(
        children: [
          Text(
            weekday,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade500,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            dayNum,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isActive ? Colors.blue : (isDark ? Colors.white : Colors.black87),
            ),
          ),
          if (isActive) ...[
            const SizedBox(height: 4),
            Container(
              width: 4,
              height: 4,
              decoration: const BoxDecoration(
                color: Colors.blue,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildMuscleBar(String name, int val, int maxVal, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          SizedBox(
            width: 70,
            child: Text(name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: val / maxVal,
                backgroundColor: Colors.grey.shade200,
                color: color,
                minHeight: 8,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text('$val sets', style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

// Custom Painter para desenhar silhueta corporal (frontal e traseira)
class MuscleHeatmapPainter extends CustomPainter {
  final bool isDark;
  MuscleHeatmapPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final paintBody = Paint()
      ..color = isDark ? Colors.grey.shade800 : Colors.grey.shade300
      ..style = PaintingStyle.fill;

    final paintHeat = Paint()
      ..color = Colors.blue.withOpacity(0.55)
      ..style = PaintingStyle.fill;

    // Desenha duas figuras lado a lado (Frontal em x=width*0.25, Traseira em x=width*0.75)
    _drawSilhouette(canvas, size, size.width * 0.25, paintBody, paintHeat, isFront: true);
    _drawSilhouette(canvas, size, size.width * 0.75, paintBody, paintHeat, isFront: false);
  }

  void _drawSilhouette(Canvas canvas, Size size, double cx, Paint bodyPaint, Paint heatPaint, {required bool isFront}) {
    final double headY = size.height * 0.15;
    final double headRadius = size.height * 0.08;
    
    // 1. Head
    canvas.drawCircle(Offset(cx, headY), headRadius, bodyPaint);

    // 2. Neck
    final neckRect = Rect.fromLTWH(cx - size.width * 0.02, headY + headRadius, size.width * 0.04, size.height * 0.05);
    canvas.drawRect(neckRect, bodyPaint);

    // 3. Torso / Chest
    final torsoTop = headY + headRadius + size.height * 0.04;
    final torsoHeight = size.height * 0.32;
    final torsoWidth = size.width * 0.14;
    final torsoPath = Path()
      ..moveTo(cx - torsoWidth / 2, torsoTop)
      ..lineTo(cx + torsoWidth / 2, torsoTop)
      ..lineTo(cx + torsoWidth * 0.4, torsoTop + torsoHeight)
      ..lineTo(cx - torsoWidth * 0.4, torsoTop + torsoHeight)
      ..close();
    canvas.drawPath(torsoPath, bodyPaint);

    // Músculos treinados (Peito na frente, Costas atrás)
    if (isFront) {
      // Peito destacado em azul
      final chestPath = Path()
        ..moveTo(cx - torsoWidth * 0.45, torsoTop + 10)
        ..lineTo(cx + torsoWidth * 0.45, torsoTop + 10)
        ..lineTo(cx + torsoWidth * 0.3, torsoTop + torsoHeight * 0.45)
        ..lineTo(cx - torsoWidth * 0.3, torsoTop + torsoHeight * 0.45)
        ..close();
      canvas.drawPath(chestPath, heatPaint);
    } else {
      // Costas destacadas em azul
      final backPath = Path()
        ..moveTo(cx - torsoWidth * 0.4, torsoTop + 5)
        ..lineTo(cx + torsoWidth * 0.4, torsoTop + 5)
        ..lineTo(cx + torsoWidth * 0.35, torsoTop + torsoHeight * 0.7)
        ..lineTo(cx - torsoWidth * 0.35, torsoTop + torsoHeight * 0.7)
        ..close();
      canvas.drawPath(backPath, heatPaint);
    }

    // 4. Arms
    final armWidth = size.width * 0.035;
    final armHeight = size.height * 0.3;
    // Left Arm
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(cx - torsoWidth * 0.72, torsoTop, armWidth, armHeight),
        const Radius.circular(4),
      ),
      bodyPaint,
    );
    // Right Arm
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(cx + torsoWidth * 0.72 - armWidth, torsoTop, armWidth, armHeight),
        const Radius.circular(4),
      ),
      bodyPaint,
    );

    // 5. Legs
    final legWidth = size.width * 0.05;
    final legHeight = size.height * 0.38;
    final legTop = torsoTop + torsoHeight;
    // Left Leg
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(cx - torsoWidth * 0.42, legTop, legWidth, legHeight),
        const Radius.circular(6),
      ),
      isFront ? heatPaint : bodyPaint, // Pernas treinadas na frente (Quads)!
    );
    // Right Leg
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(cx + torsoWidth * 0.42 - legWidth, legTop, legWidth, legHeight),
        const Radius.circular(6),
      ),
      isFront ? heatPaint : bodyPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
