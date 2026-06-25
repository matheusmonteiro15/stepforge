import 'package:flutter/material.dart';

class CalendarStatsScreen extends StatelessWidget {
  const CalendarStatsScreen({super.key});

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
        title: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Mês',
                style: TextStyle(
                  color: isDark ? Colors.white : Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              const Icon(Icons.keyboard_arrow_down, size: 18),
            ],
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Icon(Icons.ios_share, color: isDark ? Colors.white70 : Colors.black54),
          const SizedBox(width: 12),
          Icon(Icons.tune, color: isDark ? Colors.white70 : Colors.black54),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Row de Sequências (Streak / Rest)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.local_fire_department, color: Colors.orange, size: 20),
                    const SizedBox(width: 4),
                    Text(
                      'Sequência de 0 semanas',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.nights_stay, color: Colors.blue, size: 20),
                    const SizedBox(width: 4),
                    Text(
                      '18 dias de descanso',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Dias da Semana (Header do Calendário)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildWeekdayHeader('Dom'),
                _buildWeekdayHeader('Seg'),
                _buildWeekdayHeader('Ter'),
                _buildWeekdayHeader('Qua'),
                _buildWeekdayHeader('Qui'),
                _buildWeekdayHeader('Sex'),
                _buildWeekdayHeader('Sáb'),
              ],
            ),
            const SizedBox(height: 16),

            // Dias do fim de Abril 2026
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 7,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              children: [
                _buildCalendarDay('5', isGreyed: true),
                _buildCalendarDay('6', isGreyed: true),
                _buildCalendarDay('7', isGreyed: true),
                _buildCalendarDay('8', isGreyed: true),
                _buildCalendarDay('9', isGreyed: true),
                _buildCalendarDay('10', isGreyed: true),
                _buildCalendarDay('11', isGreyed: true),
                
                _buildCalendarDay('12', isGreyed: true),
                _buildCalendarDay('13', isGreyed: true),
                _buildCalendarDay('14', isGreyed: true),
                _buildCalendarDay('15', isGreyed: true),
                _buildCalendarDay('16', isGreyed: true),
                _buildCalendarDay('17', isGreyed: true),
                _buildCalendarDay('18', isGreyed: true),
                
                _buildCalendarDay('19', isGreyed: true),
                _buildCalendarDay('20', isGreyed: true),
                _buildCalendarDay('21', isGreyed: true),
                _buildCalendarDay('22', isGreyed: true),
                _buildCalendarDay('23', isGreyed: true),
                _buildCalendarDay('24', isGreyed: true),
                _buildCalendarDay('25', isGreyed: true),
                
                _buildCalendarDay('26', isGreyed: true),
                _buildCalendarDay('27', isGreyed: true),
                _buildCalendarDay('28', isGreyed: true),
                _buildCalendarDay('29', isGreyed: true),
                _buildCalendarDay('30', isGreyed: true),
                const SizedBox(),
                const SizedBox(),
              ],
            ),
            const SizedBox(height: 16),

            // Título do Mês (Maio 2026)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: Text(
                'Maio 2026',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black,
                ),
              ),
            ),

            // Dias de Maio 2026
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 7,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              children: [
                // Primeiro dia de Maio 2026 foi Sexta
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
                _buildCalendarDay('1'),
                _buildCalendarDay('2'),

                _buildCalendarDay('3'),
                _buildCalendarDay('4'),
                _buildCalendarDay('5'),
                // Dia 6 treinado com "Perna" destacada
                _buildCalendarDay('6', isTrained: true, trainedLabel: 'Perna'),
                _buildCalendarDay('7'),
                _buildCalendarDay('8'),
                _buildCalendarDay('9'),

                _buildCalendarDay('10'),
                _buildCalendarDay('11'),
                _buildCalendarDay('12'),
                _buildCalendarDay('13'),
                _buildCalendarDay('14'),
                _buildCalendarDay('15'),
                _buildCalendarDay('16'),

                _buildCalendarDay('17'),
                _buildCalendarDay('18'),
                _buildCalendarDay('19'),
                _buildCalendarDay('20'),
                _buildCalendarDay('21'),
                _buildCalendarDay('22'),
                _buildCalendarDay('23'),

                _buildCalendarDay('24'),
                // Dia 25 (Data atual no print) destacado opcionalmente
                _buildCalendarDay('25', isToday: true),
                _buildCalendarDay('26'),
                _buildCalendarDay('27'),
                _buildCalendarDay('28'),
                _buildCalendarDay('29'),
                _buildCalendarDay('30'),

                _buildCalendarDay('31'),
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
                const SizedBox(),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildWeekdayHeader(String day) {
    return Expanded(
      child: Center(
        child: Text(
          day,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildCalendarDay(
    String dayNum, {
    bool isGreyed = false,
    bool isTrained = false,
    bool isToday = false,
    String? trainedLabel,
  }) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isTrained ? Colors.blue : Colors.transparent,
              shape: BoxShape.circle,
              border: isToday ? Border.all(color: Colors.blue, width: 1.5) : null,
            ),
            child: Center(
              child: Text(
                dayNum,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: (isTrained || isToday) ? FontWeight.bold : FontWeight.w500,
                  color: isTrained
                      ? Colors.white
                      : (isGreyed
                          ? Colors.grey.shade400
                          : (isToday ? Colors.blue : Colors.black87)),
                ),
              ),
            ),
          ),
          if (trainedLabel != null) ...[
            const SizedBox(height: 2),
            Text(
              trainedLabel,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 9,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
