import flet as ft
import styles as st
import data_service as ds
import datetime

def main(page: ft.Page):
    print("--- INICIANDO STEPFORGE V5 (GROUP SELECT) ---")
    page.title = "StepForge - AppAcademia Prototype"
    page.theme_mode = ft.ThemeMode.DARK
    page.padding = 0
    page.bgcolor = st.COLOR_BG
    page.window_width = 1250
    page.window_height = 850

    current_filter = "all"
    current_ranking_tab = "weekly"

    def navigate_to(view_name, target_id=None):
        print(f"Nav -> {view_name} ({target_id})")
        content_area.content = views[view_name](target_id) if target_id else views[view_name]()
        for item in sidebar_items.controls:
            if isinstance(item, ft.Container):
                item.bgcolor = ft.colors.TRANSPARENT
                if hasattr(item, "data") and item.data == view_name:
                    item.bgcolor = "rgba(124, 58, 237, 0.15)"
        page.update()

    def SidebarItem(icon_name, label, view_name):
        return ft.Container(
            content=ft.Row([
                ft.Icon(icon_name, size=22, color=st.COLOR_PRIMARY),
                ft.Text(label, size=15, weight=ft.FontWeight.W_500, color=st.COLOR_TEXT)
            ], spacing=15),
            padding=ft.padding.symmetric(horizontal=15, vertical=12),
            border_radius=10, on_click=lambda _: navigate_to(view_name),
            data=view_name, ink=True
        )

    def open_add_workout_advanced(e):
        title_f = ft.TextField(label="Título do Treino", border_color=st.COLOR_BORDER, border_radius=10)
        desc_f = ft.TextField(label="Descrição", border_color=st.COLOR_BORDER, border_radius=10)
        dur_f = ft.TextField(label="Duração (min)", value="45", border_color=st.COLOR_BORDER, border_radius=10, width=150)
        exercises_list = ft.Column(spacing=10)

        def add_ex_row(e=None):
            row = ft.Row([
                ft.TextField(label="Exercício", border_color=st.COLOR_BORDER, border_radius=8, expand=True),
                ft.TextField(label="Séries", value="3", border_color=st.COLOR_BORDER, border_radius=8, width=70),
                ft.TextField(label="Reps", value="10", border_color=st.COLOR_BORDER, border_radius=8, width=70),
                ft.TextField(label="Peso", value="0", border_color=st.COLOR_BORDER, border_radius=8, width=80),
                ft.IconButton(ft.icons.DELETE_OUTLINE, icon_color=ft.colors.RED_400,
                              on_click=lambda _: (exercises_list.controls.remove(row), page.update()))
            ], spacing=5)
            exercises_list.controls.append(row)
            page.update()
        add_ex_row()

        def save_workout(e):
            if not title_f.value: return
            exs = []
            for row in exercises_list.controls:
                name = row.controls[0].value
                if name:
                    exs.append({"id": f"ex{len(exs)}", "name": name,
                                "sets": int(row.controls[1].value or 3),
                                "reps": int(row.controls[2].value or 10),
                                "weight": float(row.controls[3].value or 0)})
            ds.WORKOUTS.insert(0, {"id": str(len(ds.WORKOUTS)+100), "title": title_f.value,
                                   "description": desc_f.value or "", "status": "planned",
                                   "duration": int(dur_f.value or 0), "exercises": exs})
            page.dialog.open = False
            navigate_to("workouts")

        page.dialog = ft.AlertDialog(
            title=ft.Text("Novo Treino 🏋️"),
            content=ft.Container(
                content=ft.Column([title_f, desc_f, dur_f, ft.Divider(color=st.COLOR_BORDER),
                                   ft.Text("Exercícios", weight=ft.FontWeight.BOLD), exercises_list,
                                   ft.TextButton("+ Adicionar Exercício", on_click=add_ex_row)],
                                  scroll=ft.ScrollMode.ADAPTIVE, tight=True, spacing=12),
                width=550, height=420),
            actions=[ft.TextButton("Cancelar", on_click=lambda _: setattr(page.dialog, "open", False)),
                     st.PrimaryButton("Salvar", save_workout, width=120)],
            bgcolor=st.COLOR_CARD)
        page.dialog.open = True
        page.update()

    # ========== VIEWS ==========

    def DashboardView(tid=None):
        stats = ds.get_stats()
        weekly = ds.get_weekly_activity()
        max_min = max(d["minutes"] for d in weekly) or 1
        chart_bars = ft.Row([
            ft.Column([
                ft.Container(width=30, height=(d["minutes"]/max_min)*120 if d["minutes"]>0 else 5,
                             gradient=st.GRADIENT_PRIMARY, border_radius=5),
                ft.Text(d["day"], size=12, color=st.COLOR_TEXT_MUTED)
            ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=10) for d in weekly
        ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN, expand=True)

        recent = []
        for w in ds.get_workouts()[:4]:
            recent.append(ft.Container(
                content=ft.ListTile(
                    leading=ft.Icon(ft.icons.FITNESS_CENTER, color=st.COLOR_PRIMARY),
                    title=ft.Text(w.get("title",""), weight=ft.FontWeight.BOLD, size=14),
                    subtitle=ft.Text(f"{len(w.get('exercises',[]))} ex • {w.get('duration',0)} min", color=st.COLOR_TEXT_MUTED)),
                border=ft.border.only(bottom=ft.border.BorderSide(1, st.COLOR_BORDER))))

        return ft.Column([
            ft.Row([ft.Column([ft.Text(f"Olá, {ds.USER['name'].split()[0]}! 👋", size=32, weight=ft.FontWeight.BOLD),
                               ft.Text("Seu progresso está excelente.", color=st.COLOR_TEXT_MUTED)]),
                    ft.IconButton(ft.icons.NOTIFICATIONS_OUTLINED, icon_color=st.COLOR_PRIMARY)],
                   alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
            ft.Container(height=30),
            ft.ResponsiveRow([
                st.StatCard("Treinos", str(stats["total_workouts"]), ft.icons.FITNESS_CENTER, "#7C3AED", col=3),
                st.StatCard("Feitos", str(stats["completed_workouts"]), ft.icons.CHECK_CIRCLE, "#10B981", col=3),
                st.StatCard("Média", stats["avg_duration"], ft.icons.TIMER, "#F59E0B", col=3),
                st.StatCard("Exercícios", str(stats["total_exercises"]), ft.icons.BOLT, "#EF4444", col=3),
            ], spacing=20),
            ft.Container(height=30),
            ft.ResponsiveRow([
                st.GlassContainer(col=7, content=ft.Column([
                    st.SectionHeader("Atividade Semanal", ft.icons.STACKED_BAR_CHART),
                    ft.Container(height=20), ft.Container(content=chart_bars, height=140)])),
                st.GlassContainer(col=5, content=ft.Column([
                    st.SectionHeader("Recentes", ft.icons.HISTORY),
                    ft.Container(height=10), ft.Column(recent)]))
            ], spacing=20)
        ], scroll=ft.ScrollMode.ADAPTIVE)

    def WorkoutsView(tid=None):
        nonlocal current_filter
        def set_f(f):
            nonlocal current_filter
            current_filter = f
            navigate_to("workouts")

        filter_btns = ft.Row([
            ft.Container(
                content=ft.Text(label, size=13, weight=ft.FontWeight.BOLD,
                                color=st.COLOR_TEXT if current_filter==val else st.COLOR_TEXT_MUTED),
                padding=ft.padding.symmetric(horizontal=16, vertical=10),
                bgcolor="rgba(124, 58, 237, 0.2)" if current_filter==val else ft.colors.TRANSPARENT,
                border_radius=8, border=ft.border.all(1, st.COLOR_PRIMARY if current_filter==val else st.COLOR_BORDER),
                on_click=lambda _, v=val: set_f(v), ink=True
            ) for label, val in [("Todos","all"),("Planejado","planned"),("Andamento","in_progress"),("Concluído","completed")]
        ], spacing=10)

        cards = []
        for w in [x for x in ds.get_workouts() if current_filter=="all" or x.get("status")==current_filter]:
            ex_rows = []
            for ex in w.get("exercises",[])[:3]:
                detail = f"{ex.get('sets','?')}x{ex.get('reps','?')}"
                wt = ex.get("weight", 0)
                if wt: detail += f" • {int(wt)}kg"
                ex_rows.append(ft.Row([ft.Text(ex.get("name",""), size=13, expand=True),
                                       ft.Text(detail, size=13, color=st.COLOR_TEXT_MUTED)]))
            status = w.get("status","planned")
            def handle_tog(e, wid=w["id"]): ds.toggle_workout_status(wid); navigate_to("workouts")
            def handle_del(e, wid=w["id"]): ds.delete_workout(wid); navigate_to("workouts")
            cards.append(st.GlassContainer(col=6, content=ft.Column([
                ft.Row([ft.Text(w.get("title",""), size=18, weight=ft.FontWeight.BOLD, expand=True),
                        ft.Container(content=ft.Text(status.replace("_"," ").upper(), size=9, weight=ft.FontWeight.BOLD),
                                     padding=ft.padding.symmetric(horizontal=8, vertical=4), bgcolor="rgba(124,58,237,0.1)", border_radius=5)]),
                ft.Divider(color=st.COLOR_BORDER, height=10),
                ft.Column(ex_rows, spacing=4), ft.Container(height=10),
                ft.Row([st.PrimaryButton({"planned":"▶️ Iniciar","in_progress":"✅ Concluir","completed":"🔄 Refazer"}.get(status,""), handle_tog, expand=True),
                        ft.IconButton(ft.icons.DELETE_OUTLINE, icon_color=ft.colors.RED_400, on_click=handle_del)], spacing=10)
            ])))

        empty = ft.Container(content=ft.Column([ft.Icon(ft.icons.FITNESS_CENTER, size=50, color=st.COLOR_TEXT_MUTED),
                                                 ft.Text("Nenhum treino.", color=st.COLOR_TEXT_MUTED)],
                                                horizontal_alignment=ft.CrossAxisAlignment.CENTER), padding=80)
        return ft.Column([
            ft.Row([ft.Text("Meus Treinos", size=28, weight=ft.FontWeight.BOLD),
                    st.PrimaryButton("+ Novo Treino", open_add_workout_advanced, width=160)],
                   alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
            ft.Container(height=20), filter_btns, ft.Container(height=20),
            ft.ResponsiveRow(cards, spacing=20) if cards else empty
        ], scroll=ft.ScrollMode.ADAPTIVE)

    def ProfileView(user_id=None):
        user = ds.get_profile(user_id)
        is_me = (not user_id or user_id == ds.USER["id"])
        calendar_days = []
        for i in range(1, 32):
            date_str = f"2026-03-{i:02d}"
            day_data = user.get("history", {}).get(date_str)
            if day_data and day_data.get("photo"):
                content = ft.Image(src=day_data["photo"], width=40, height=40, fit=ft.ImageFit.COVER, border_radius=8)
            elif day_data:
                content = ft.Container(content=ft.Icon(ft.icons.CHECK, color=st.COLOR_PRIMARY, size=15),
                                       border_radius=8, bgcolor="rgba(124, 58, 237, 0.1)")
            else:
                content = ft.Text(str(i), size=12, color=st.COLOR_TEXT_MUTED)
            calendar_days.append(ft.Container(content=content, alignment=ft.alignment.center,
                                              width=45, height=45, bgcolor=st.COLOR_CARD, border_radius=10,
                                              border=ft.border.all(1, st.COLOR_BORDER)))
        back = ft.IconButton(ft.icons.ARROW_BACK, on_click=lambda _: navigate_to("groups")) if not is_me else ft.Container()
        return ft.Column([
            ft.Row([back, ft.Text("Perfil do Atleta" if not is_me else "Meu Perfil", size=24, weight=ft.FontWeight.BOLD)]),
            ft.Container(height=20),
            st.GlassContainer(content=ft.Row([
                st.CustomAvatar(user.get("avatar",""), radius=45), ft.Container(width=15),
                ft.Column([ft.Text(user.get("name",""), size=22, weight=ft.FontWeight.BOLD),
                           ft.Text(user.get("email","Membro"), color=st.COLOR_TEXT_MUTED),
                           ft.Row([ft.Chip(label=ft.Text(f"🔥 {user.get('streak',0)} dias")),
                                   ft.Chip(label=ft.Text(user.get("level","Iniciante")))])])])),
            ft.Container(height=25),
            ft.ResponsiveRow([
                st.StatCard("Check-ins", str(user.get("check_ins",0)), ft.icons.CHECK, "#10B981", col=4),
                st.StatCard("Dias Ativos", str(user.get("active_days",0)), ft.icons.CALENDAR_MONTH, "#7C3AED", col=4),
                st.StatCard("Tempo", user.get("active_time","0 min"), ft.icons.TIMER, "#F59E0B", col=4),
            ], spacing=15),
            ft.Container(height=30),
            st.SectionHeader("Calendário de Treinos", ft.icons.EVENT_AVAILABLE),
            ft.Container(height=15),
            ft.GridView(calendar_days, runs_count=7, max_extent=50, spacing=10, run_spacing=10, expand=False, height=280),
        ], scroll=ft.ScrollMode.ADAPTIVE)

    def CreateGroupView(tid=None):
        name_f = ft.TextField(label="Nome do Grupo", border_color=st.COLOR_BORDER, border_radius=12, width=400)
        desc_f = ft.TextField(label="Descrição", border_color=st.COLOR_BORDER, border_radius=12, width=400, multiline=True, min_lines=2)
        group_type = {"value": "challenge"}

        def set_type(t):
            group_type["value"] = t
            challenge_card.border = ft.border.all(2, st.COLOR_PRIMARY if t == "challenge" else st.COLOR_BORDER)
            club_card.border = ft.border.all(2, st.COLOR_ACCENT if t == "club" else st.COLOR_BORDER)
            page.update()

        def create_group(e):
            if not name_f.value: return
            ds.GROUPS.append({"id": f"g{len(ds.GROUPS)+1}", "name": name_f.value,
                              "type": group_type["value"], "members": 1, "posts": 0,
                              "description": desc_f.value or ""})
            navigate_to("groups")

        challenge_card = ft.Container(
            content=ft.Column([
                ft.Container(ft.Icon(ft.icons.STAR, size=40, color="#F59E0B"), padding=15, border_radius=20, bgcolor="rgba(245,158,11,0.1)"),
                ft.Text("Desafio", size=20, weight=ft.FontWeight.BOLD),
                ft.Text("Metas de curto prazo.\nEx: '30 dias'", color=st.COLOR_TEXT_MUTED, text_align=ft.TextAlign.CENTER, size=13),
            ], spacing=12, horizontal_alignment=ft.CrossAxisAlignment.CENTER),
            width=250, height=220, padding=25, border_radius=20, bgcolor=st.COLOR_CARD,
            border=ft.border.all(2, st.COLOR_PRIMARY), on_click=lambda _: set_type("challenge"),
            ink=True, alignment=ft.alignment.center)

        club_card = ft.Container(
            content=ft.Column([
                ft.Container(ft.Icon(ft.icons.GROUPS, size=40, color=st.COLOR_ACCENT), padding=15, border_radius=20, bgcolor="rgba(6,182,212,0.1)"),
                ft.Text("Clube", size=20, weight=ft.FontWeight.BOLD),
                ft.Text("Comunidade contínua.\nTroca de experiências.", color=st.COLOR_TEXT_MUTED, text_align=ft.TextAlign.CENTER, size=13),
            ], spacing=12, horizontal_alignment=ft.CrossAxisAlignment.CENTER),
            width=250, height=220, padding=25, border_radius=20, bgcolor=st.COLOR_CARD,
            border=ft.border.all(2, st.COLOR_BORDER), on_click=lambda _: set_type("club"),
            ink=True, alignment=ft.alignment.center)

        return ft.Column([
            ft.Text("Criar Novo Grupo 🚀", size=28, weight=ft.FontWeight.BOLD),
            ft.Text("Escolha o tipo e dê um nome ao seu grupo.", color=st.COLOR_TEXT_MUTED),
            ft.Container(height=30),
            ft.Text("Tipo de Grupo", weight=ft.FontWeight.BOLD, size=16), ft.Container(height=10),
            ft.Row([challenge_card, ft.Container(width=25), club_card]),
            ft.Container(height=30),
            ft.Text("Detalhes", weight=ft.FontWeight.BOLD, size=16), ft.Container(height=10),
            name_f, ft.Container(height=10), desc_f, ft.Container(height=25),
            st.PrimaryButton("Criar Grupo", create_group, width=200),
        ], scroll=ft.ScrollMode.ADAPTIVE)

    # ===== GROUP LISTING (shows all groups) =====
    def GroupsView(tid=None):
        group_cards = []
        for g in ds.GROUPS:
            type_icon = ft.icons.STAR if g["type"] == "challenge" else ft.icons.GROUPS
            type_color = "#F59E0B" if g["type"] == "challenge" else st.COLOR_ACCENT
            type_label = "Desafio" if g["type"] == "challenge" else "Clube"

            group_cards.append(st.GlassContainer(col=6,
                on_click=lambda _, gid=g["id"]: navigate_to("group_detail", gid),
                content=ft.Column([
                    ft.Row([
                        ft.Container(ft.Icon(type_icon, size=28, color=type_color), padding=10, border_radius=12,
                                     bgcolor=ft.colors.with_opacity(0.1, type_color)),
                        ft.Column([ft.Text(g["name"], size=18, weight=ft.FontWeight.BOLD),
                                   ft.Text(type_label, size=12, color=type_color, weight=ft.FontWeight.BOLD)], spacing=2, expand=True),
                    ], spacing=15),
                    ft.Container(height=5),
                    ft.Text(g.get("description",""), size=13, color=st.COLOR_TEXT_MUTED),
                    ft.Container(height=10),
                    ft.Row([ft.Text(f"👥 {g['members']} membros", size=12, color=st.COLOR_TEXT_MUTED),
                            ft.Text(f"📝 {g['posts']} posts", size=12, color=st.COLOR_TEXT_MUTED)], spacing=20),
                ])))

        empty = ft.Container(content=ft.Column([ft.Icon(ft.icons.GROUPS, size=50, color=st.COLOR_TEXT_MUTED),
                                                 ft.Text("Nenhum grupo. Crie o primeiro!", color=st.COLOR_TEXT_MUTED)],
                                                horizontal_alignment=ft.CrossAxisAlignment.CENTER), padding=80)
        return ft.Column([
            ft.Row([ft.Text("Meus Grupos", size=28, weight=ft.FontWeight.BOLD),
                    st.PrimaryButton("+ Criar Grupo", lambda _: navigate_to("create_group"), width=160)],
                   alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
            ft.Container(height=20),
            ft.ResponsiveRow(group_cards, spacing=20) if group_cards else empty
        ], scroll=ft.ScrollMode.ADAPTIVE)

    # ===== GROUP DETAIL (feed + ranking for one group) =====
    def GroupDetailView(group_id=None):
        nonlocal current_ranking_tab
        group = None
        for g in ds.GROUPS:
            if g["id"] == group_id:
                group = g
                break
        if not group:
            group = ds.GROUPS[0] if ds.GROUPS else {"name":"Grupo","members":0,"posts":0}

        feed_items = []
        for act in ds.ACTIVITIES:
            photo_w = ft.Image(src=act["photo"], border_radius=12, width=500, height=280, fit=ft.ImageFit.COVER) if act.get("photo") else ft.Container()
            card = st.GlassContainer(content=ft.Column([
                ft.Row([st.CustomAvatar(act["user_avatar"], radius=20),
                        ft.Column([ft.Text(act["user_name"], weight=ft.FontWeight.BOLD),
                                   ft.Text(act["time"], size=10, color=st.COLOR_TEXT_MUTED)], spacing=0),
                        ft.Container(expand=True)], vertical_alignment=ft.CrossAxisAlignment.CENTER),
                ft.Text(act["content"], size=14), photo_w,
                ft.Row([ft.Row([ft.Icon(ft.icons.FAVORITE_BORDER, size=18, color=st.COLOR_TEXT_MUTED), ft.Text(str(act["likes"]), color=st.COLOR_TEXT_MUTED)]),
                        ft.Row([ft.Icon(ft.icons.CHAT_BUBBLE_OUTLINE, size=18, color=st.COLOR_TEXT_MUTED), ft.Text("2", color=st.COLOR_TEXT_MUTED)])], spacing=20)
            ], spacing=12))
            feed_items.append(ft.Container(content=card, on_click=lambda _, pid=act["id"]: navigate_to("post_detail", pid), ink=True, border_radius=15, margin=ft.margin.only(bottom=15)))

        ranking_data = ds.RANKINGS.get(current_ranking_tab, ds.RANKINGS["weekly"])
        ranking_list = ft.Column([
            st.RankingItem(i+1, u["name"], u["avatar"], u["score"],
                           on_click=lambda _, uid=u["user_id"]: navigate_to("profile", uid))
            for i, u in enumerate(ranking_data)], spacing=8)

        def set_rt(t):
            nonlocal current_ranking_tab
            current_ranking_tab = t
            navigate_to("group_detail", group_id)

        def show_group_info(e):
            participants = []
            for u in ds.RANKINGS["weekly"]:
                participants.append(ft.ListTile(
                    leading=st.CustomAvatar(u["avatar"], radius=20),
                    title=ft.Text(u["name"]),
                    subtitle=ft.Text(f"{u['score']} pts")
                ))
            page.dialog = ft.AlertDialog(
                title=ft.Text(f"Detalhes: {group['name']}"),
                content=ft.Column([
                    ft.Text(group.get("description", ""), color=st.COLOR_TEXT_MUTED),
                    ft.Divider(color=st.COLOR_BORDER),
                    ft.Text("Membros Relevantes", weight=ft.FontWeight.BOLD),
                    ft.Column(participants, spacing=5, scroll=ft.ScrollMode.ADAPTIVE)
                ], tight=True),
                actions=[ft.TextButton("Fechar", on_click=lambda _: (setattr(page.dialog, "open", False), page.update()))],
                bgcolor=st.COLOR_CARD
            )
            page.dialog.open = True
            page.update()

        def open_new_checkin(e):
            content_f = ft.TextField(label="Como foi o treino hoje?", border_color=st.COLOR_BORDER, border_radius=10, multiline=True, min_lines=3)
            
            def add_checkin(e):
                if not content_f.value: return
                new_act = {
                    "id": f"a{len(ds.ACTIVITIES)+1}", "user_id": ds.USER["id"],
                    "user_name": ds.USER["name"], "user_avatar": ds.USER.get("avatar", ""),
                    "content": content_f.value, "photo": "", "likes": 0, "time": "Agora"
                }
                ds.ACTIVITIES.insert(0, new_act)
                page.dialog.open = False
                navigate_to("group_detail", group_id)

            page.dialog = ft.AlertDialog(
                title=ft.Text("Novo Check-in 📸"),
                content=ft.Column([
                    content_f,
                    ft.Row([ft.Icon(ft.icons.IMAGE, color=st.COLOR_TEXT_MUTED), ft.Text("Adicionar Foto (em breve)", color=st.COLOR_TEXT_MUTED)])
                ], tight=True),
                actions=[
                    ft.TextButton("Cancelar", on_click=lambda _: (setattr(page.dialog, "open", False), page.update())),
                    st.PrimaryButton("Publicar", add_checkin, width=120)
                ],
                bgcolor=st.COLOR_CARD
            )
            page.dialog.open = True
            page.update()

        return ft.Column([
            ft.Row([
                ft.Row([ft.IconButton(ft.icons.ARROW_BACK, on_click=lambda _: navigate_to("groups")),
                        ft.Text(group["name"], size=28, weight=ft.FontWeight.BOLD)]),
                ft.Row([
                    ft.OutlinedButton("Detalhes", on_click=show_group_info, style=ft.ButtonStyle(color=st.COLOR_TEXT, side=ft.border.BorderSide(1, st.COLOR_BORDER))),
                    st.PrimaryButton("+ Check-in", open_new_checkin, width=130)
                ], spacing=10)
            ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
            ft.Row([ft.Text(f"🔥 {group['members']} membros", color=st.COLOR_PRIMARY), ft.Text("•"),
                    ft.Text(f"{group['posts']} posts", color=st.COLOR_TEXT_MUTED)], spacing=10),
            ft.Container(height=20),
            ft.Row([
                ft.Column([st.SectionHeader("Feed", ft.icons.DYNAMIC_FEED), ft.Container(height=15),
                           ft.Column(feed_items, scroll=ft.ScrollMode.ADAPTIVE, height=550)], expand=7),
                ft.Container(width=25),
                ft.Column([
                    st.SectionHeader("Classificação", ft.icons.LEADERBOARD), ft.Container(height=10),
                    ft.Row([ft.TextButton("Semana", on_click=lambda _: set_rt("weekly")),
                            ft.TextButton("Mês", on_click=lambda _: set_rt("monthly"))], spacing=5),
                    ft.Container(height=10), ranking_list, ft.Container(height=30),
                    st.GlassContainer(content=ft.Column([ft.Text("Meta de Hoje", weight=ft.FontWeight.BOLD),
                                                          ft.ProgressBar(value=0.6, color=st.COLOR_PRIMARY),
                                                          ft.Text("6/10 completaram", size=12, color=st.COLOR_TEXT_MUTED)]), padding=15)
                ], expand=3)
            ])
        ])

    def PostDetailView(post_id=None):
        act = next((a for a in ds.ACTIVITIES if a["id"] == post_id), None)
        if not act:
            return ft.Column([ft.Text("Post não encontrado.", color=ft.colors.RED_400)])
            
        comments = [
            ft.ListTile(leading=st.CustomAvatar("https://i.pravatar.cc/150?u=c1", radius=15), title=ft.Text("Lucas Mendes"), subtitle=ft.Text("Boa, monstro! 💪")),
            ft.ListTile(leading=st.CustomAvatar("https://i.pravatar.cc/150?u=c2", radius=15), title=ft.Text("Mariana Silva"), subtitle=ft.Text("Inspirador! Amanhã é minha vez."))
        ]

        comment_input = ft.TextField(label="Adicione um comentário...", border_color=st.COLOR_BORDER, border_radius=10, expand=True)
        comments_list = ft.Column(comments, spacing=2)

        def add_comment(e):
            if not comment_input.value: return
            comments_list.controls.append(ft.ListTile(leading=st.CustomAvatar(ds.USER.get("avatar", ""), radius=15), title=ft.Text(ds.USER["name"]), subtitle=ft.Text(comment_input.value)))
            comment_input.value = ""
            comments_list.update()
            
        photo_w = ft.Image(src=act["photo"], border_radius=12, width=600, fit=ft.ImageFit.COVER) if act.get("photo") else ft.Container()
        return ft.Column([
            ft.Row([ft.IconButton(ft.icons.ARROW_BACK, on_click=lambda _, pid=post_id: navigate_to("groups")), ft.Text("Publicação", size=24, weight=ft.FontWeight.BOLD)]),
            st.GlassContainer(content=ft.Column([
                ft.Row([st.CustomAvatar(act["user_avatar"], radius=20),
                        ft.Column([ft.Text(act["user_name"], weight=ft.FontWeight.BOLD),
                                   ft.Text(act["time"], size=10, color=st.COLOR_TEXT_MUTED)], spacing=0)], vertical_alignment=ft.CrossAxisAlignment.CENTER),
                ft.Text(act["content"], size=16),
                photo_w,
                ft.Row([ft.Row([ft.Icon(ft.icons.FAVORITE_BORDER, size=18, color=st.COLOR_TEXT_MUTED), ft.Text(str(act["likes"]), color=st.COLOR_TEXT_MUTED)]),
                        ft.Row([ft.Icon(ft.icons.CHAT_BUBBLE_OUTLINE, size=18, color=st.COLOR_TEXT_MUTED), ft.Text(str(len(comments_list.controls)), color=st.COLOR_TEXT_MUTED)])], spacing=20)
            ], spacing=15)),
            ft.Text("Comentários", size=18, weight=ft.FontWeight.BOLD),
            st.GlassContainer(content=ft.Column([
                comments_list,
                ft.Divider(color=st.COLOR_BORDER),
                ft.Row([comment_input, st.PrimaryButton("Enviar", add_comment)])
            ]))
        ], scroll=ft.ScrollMode.ADAPTIVE)

    views = {
        "dashboard": DashboardView, "workouts": WorkoutsView, "profile": ProfileView,
        "groups": GroupsView, "group_detail": GroupDetailView, "create_group": CreateGroupView,
        "post_detail": PostDetailView,
    }

    # --- SIDEBAR ---
    sidebar_items = ft.Column([
        SidebarItem(ft.icons.DASHBOARD, "Dashboard", "dashboard"),
        SidebarItem(ft.icons.FITNESS_CENTER, "Treinos", "workouts"),
        SidebarItem(ft.icons.GROUPS, "Grupos", "groups"),
        SidebarItem(ft.icons.ADD_CIRCLE_OUTLINE, "Criar Grupo", "create_group"),
        SidebarItem(ft.icons.PERSON, "Meu Perfil", "profile"),
    ], spacing=5)

    sidebar = ft.Container(
        content=ft.Column([
            ft.Container(content=ft.Row([ft.Text("💪", size=24), ft.Text("StepForge", size=20, weight=ft.FontWeight.BOLD)]),
                         padding=ft.padding.only(bottom=30, top=10)),
            sidebar_items, ft.Container(expand=True),
            ft.Container(content=ft.Row([ft.Icon(ft.icons.LOGOUT, color=st.COLOR_TEXT_MUTED),
                                         ft.Text("Sair", color=st.COLOR_TEXT_MUTED)]),
                         on_click=lambda _: show_auth(), padding=10)
        ]), width=210, bgcolor=st.COLOR_CARD, padding=20,
        border=ft.border.only(right=ft.border.BorderSide(1, st.COLOR_BORDER)))

    content_area = ft.Container(expand=True, padding=35)

    # --- AUTH ---
    def show_auth():
        page.clean()
        email = ft.TextField(label="E-mail", border_color=st.COLOR_BORDER, border_radius=12, width=350)
        password = ft.TextField(label="Senha", password=True, can_reveal_password=True,
                                border_color=st.COLOR_BORDER, border_radius=12, width=350)
        card = st.GlassContainer(
            content=ft.Column([ft.Text("💪", size=45), ft.Text("StepForge", size=30, weight=ft.FontWeight.BOLD),
                               ft.Text("Sua evolução começa aqui", color=st.COLOR_TEXT_MUTED),
                               ft.Container(height=20), email, password, ft.Container(height=10),
                               st.PrimaryButton("Entrar", lambda _: show_app(), width=350),
                               ft.TextButton("Criar nova conta", on_click=lambda _: show_register())],
                              horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=15), padding=40, width=450)
        page.add(ft.Container(content=card, alignment=ft.alignment.center, expand=True))

    def show_register():
        page.clean()
        n = ft.TextField(label="Nome", border_color=st.COLOR_BORDER, border_radius=12, width=350)
        em = ft.TextField(label="E-mail", border_color=st.COLOR_BORDER, border_radius=12, width=350)
        pw = ft.TextField(label="Senha", password=True, border_color=st.COLOR_BORDER, border_radius=12, width=350)
        pw2 = ft.TextField(label="Confirmar Senha", password=True, border_color=st.COLOR_BORDER, border_radius=12, width=350)
        card = st.GlassContainer(
            content=ft.Column([ft.Text("💪", size=45), ft.Text("Criar Conta", size=30, weight=ft.FontWeight.BOLD),
                               ft.Container(height=15), n, em, pw, pw2, ft.Container(height=10),
                               st.PrimaryButton("Registrar", lambda _: show_app(), width=350),
                               ft.TextButton("Já tenho conta", on_click=lambda _: show_auth())],
                              horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=15), padding=40, width=450)
        page.add(ft.Container(content=card, alignment=ft.alignment.center, expand=True))

    def show_app():
        page.clean()
        page.add(ft.Row([sidebar, content_area], expand=True))
        navigate_to("dashboard")

    show_auth()

if __name__ == "__main__":
    ft.app(target=main)
