import datetime

# ===== MOCK USER =====
USER = {
    "id": "u1",
    "name": "Matheus Atleta",
    "email": "matheus@exemplo.com",
    "avatar": "https://avatars.githubusercontent.com/u/45?v=4",
    "level": "Intermediário",
    "streak": 5,
    "check_ins": 42,
    "active_days": 18,
    "active_time": "1.240 min",
    "history": {
        "2026-03-29": {"type": "workout", "photo": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"},
        "2026-03-28": {"type": "workout", "photo": "https://images.unsplash.com/photo-1541534741688-6078c64b52df?w=400"},
        "2026-03-26": {"type": "workout", "photo": None},
        "2026-03-25": {"type": "workout", "photo": "https://images.unsplash.com/photo-1599058917233-358043bc6b96?w=400"},
    }
}

OTHER_USERS = [
    {"id": "u2", "name": "Ana Silva", "avatar": "https://i.pravatar.cc/150?u=u2", "check_ins": 38, "active_time": "980 min"},
    {"id": "u3", "name": "Bruno Costa", "avatar": "https://i.pravatar.cc/150?u=u3", "check_ins": 55, "active_time": "2.100 min"},
    {"id": "u4", "name": "Carla Dias", "avatar": "https://i.pravatar.cc/150?u=u4", "check_ins": 12, "active_time": "450 min"},
]

# ===== MOCK GROUPS =====
GROUPS = [
    {"id": "g1", "name": "Foco Verão 2026", "type": "challenge", "members": 156, "posts": 42, "description": "Desafio de 30 dias para queimar gordura."},
    {"id": "g2", "name": "Clube do Supino", "type": "club", "members": 890, "posts": 1102, "description": "Comunidade para amantes de supino e peitorais."},
]

# ===== MOCK ACTIVITIES =====
ACTIVITIES = [
    {
        "id": "a1",
        "user_id": "u3",
        "user_name": "Bruno Costa",
        "user_avatar": "https://i.pravatar.cc/150?u=u3",
        "content": "Mais um treino de pernas concluído! A meta hoje foi bater o recorde no Leg Press.",
        "photo": "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500",
        "likes": 12,
        "time": "há 2h"
    },
    {
        "id": "a2",
        "user_id": "u1",
        "user_name": "Matheus Atleta",
        "user_avatar": "https://avatars.githubusercontent.com/u/45?v=4",
        "content": "Supino reto evoluindo. 80kg para 10 reps!",
        "photo": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
        "likes": 8,
        "time": "há 4h"
    },
    {
        "id": "a3",
        "user_id": "u2",
        "user_name": "Ana Silva",
        "user_avatar": "https://i.pravatar.cc/150?u=u2",
        "content": "Cardio matinal feito ✅",
        "photo": None,
        "likes": 5,
        "time": "há 6h"
    }
]

# ===== RANKINGS =====
RANKINGS = {
    "weekly": [
        {"user_id": "u3", "name": "Bruno Costa", "avatar": "https://i.pravatar.cc/150?u=u3", "score": 12},
        {"user_id": "u1", "name": "Matheus Atleta", "avatar": "https://avatars.githubusercontent.com/u/45?v=4", "score": 10},
        {"user_id": "u2", "name": "Ana Silva", "avatar": "https://i.pravatar.cc/150?u=u2", "score": 8},
    ],
    "monthly": [
        {"user_id": "u1", "name": "Matheus Atleta", "avatar": "https://avatars.githubusercontent.com/u/45?v=4", "score": 45},
        {"user_id": "u3", "name": "Bruno Costa", "avatar": "https://i.pravatar.cc/150?u=u3", "score": 42},
        {"user_id": "u2", "name": "Ana Silva", "avatar": "https://i.pravatar.cc/150?u=u2", "score": 30},
    ],
}

# ===== MOCK WORKOUTS =====
WORKOUTS = [
    {
        "id": "1",
        "title": "Treino A - Peito e Tríceps",
        "description": "Foco em hipertrofia.",
        "status": "completed",
        "duration": 60,
        "exercises": [
            {"id": "e1", "name": "Supino Reto", "sets": 4, "reps": 10, "weight": 80},
        ],
    }
]

def get_stats():
    return {
        "total_workouts": len(WORKOUTS),
        "completed_workouts": 1,
        "avg_duration": "60min",
        "total_exercises": 11
    }

def toggle_workout_status(workout_id):
    for w in WORKOUTS:
        if w.get("id") == workout_id:
            curr = w.get("status", "planned")
            w["status"] = "in_progress" if curr == "planned" else "completed" if curr == "in_progress" else "planned"
            return w
    return None

def delete_workout(workout_id):
    global WORKOUTS
    WORKOUTS = [w for w in WORKOUTS if w.get("id") != workout_id]

def get_weekly_activity():
    return [{"day": "Seg", "minutes": 45}, {"day": "Ter", "minutes": 0}, {"day": "Qua", "minutes": 60}, {"day": "Qui", "minutes": 30}, {"day": "Sex", "minutes": 0}, {"day": "Sáb", "minutes": 45}, {"day": "Dom", "minutes": 0}]

def login(email, password): return {"user": USER, "token": "mock-token"}
def register(name, email, password): return {"user": USER, "token": "mock-token"}
def get_workouts(): return WORKOUTS
def get_profile(user_id=None):
    if not user_id or user_id == USER["id"]: return USER
    for u in OTHER_USERS:
        if u["id"] == user_id: 
            return {**u, "streak": 2, "active_days": 5, "history": {}}
    return USER
