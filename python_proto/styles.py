import flet as ft

# ===== COLORS (From Web CSS) =====
COLOR_BG = "#030712"
COLOR_CARD = "#111827"
COLOR_PRIMARY = "#7C3AED"  # Violet
COLOR_ACCENT = "#06B6D4"   # Cyan
COLOR_TEXT = "#F9FAFB"
COLOR_TEXT_MUTED = "#9CA3AF"
COLOR_GLASS = "rgba(17, 24, 39, 0.7)"
COLOR_BORDER = "rgba(255, 255, 255, 0.1)"

# ===== GRADIENTS =====
GRADIENT_PRIMARY = ft.LinearGradient(
    begin=ft.alignment.top_left,
    end=ft.alignment.bottom_right,
    colors=[COLOR_PRIMARY, COLOR_ACCENT]
)

# ===== COMPONENTS =====

def GlassContainer(content, padding=20, border_radius=20, width=None, height=None, bgcolor=COLOR_CARD, **kwargs):
    return ft.Container(
        content=content,
        padding=padding,
        border_radius=border_radius,
        bgcolor=bgcolor,
        border=ft.border.all(1, COLOR_BORDER),
        width=width,
        height=height,
        shadow=ft.BoxShadow(spread_radius=1, blur_radius=15, color=ft.colors.with_opacity(0.1, ft.colors.BLACK), offset=ft.Offset(0, 5)),
        animate=ft.animation.Animation(300, ft.AnimationCurve.DECELERATE),
        **kwargs
    )

def PrimaryButton(text, on_click, width=None, expand=False, icon=None, **kwargs):
    content_list = []
    if icon:
        content_list.append(ft.Icon(icon, color=ft.colors.WHITE, size=18))
    content_list.append(ft.Text(text, size=14, weight=ft.FontWeight.BOLD, color=ft.colors.WHITE))
    
    return ft.Container(
        content=ft.Row(content_list, alignment=ft.MainAxisAlignment.CENTER, spacing=10),
        alignment=ft.alignment.center,
        width=width,
        expand=expand,
        height=45,
        border_radius=12,
        gradient=GRADIENT_PRIMARY,
        on_click=on_click,
        ink=True,
        **kwargs
    )

def StatCard(title, value, icon_name, color_accent, **kwargs):
    return GlassContainer(
        content=ft.Column([
            ft.Row([ft.Icon(icon_name, color=color_accent, size=20), ft.Text(title, size=11, weight=ft.FontWeight.W_500, color=COLOR_TEXT_MUTED)], alignment=ft.MainAxisAlignment.START, spacing=8),
            ft.Text(value, size=24, weight=ft.FontWeight.W_800, color=COLOR_TEXT)
        ], spacing=4),
        padding=16,
        **kwargs
    )

def SectionHeader(title, icon_name=None):
    controls = []
    if icon_name:
        controls.append(ft.Icon(icon_name, size=18, color=COLOR_PRIMARY))
    controls.append(ft.Text(title, size=16, weight=ft.FontWeight.BOLD, color=COLOR_TEXT))
    return ft.Row(controls, alignment=ft.MainAxisAlignment.START, spacing=10)

def CustomAvatar(url, radius=20, border_color=COLOR_PRIMARY):
    return ft.Container(
        content=ft.CircleAvatar(foreground_image_url=url, radius=radius-2 if url else radius),
        padding=2,
        bgcolor=border_color if url else ft.colors.TRANSPARENT,
        shape=ft.BoxShape.CIRCLE,
        width=radius*2,
        height=radius*2
    )

def RankingItem(rank, name, avatar, score, on_click=None):
    colors = {1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32"}
    badge_color = colors.get(rank, ft.colors.TRANSPARENT)
    
    return ft.Container(
        content=ft.Row([
            ft.Text(str(rank), size=14, weight=ft.FontWeight.BOLD, color=COLOR_TEXT_MUTED, width=15),
            CustomAvatar(avatar, radius=18, border_color=badge_color if rank <= 3 else COLOR_BORDER),
            ft.Text(name, size=14, weight=ft.FontWeight.W_600, color=COLOR_TEXT, expand=True),
            ft.Text(f"{score} pts", size=14, weight=ft.FontWeight.BOLD, color=COLOR_PRIMARY)
        ], alignment=ft.MainAxisAlignment.START, spacing=12),
        padding=12,
        border_radius=12,
        on_click=on_click,
        ink=True,
        border=ft.border.all(1, "rgba(255,255,255,0.05)")
    )
