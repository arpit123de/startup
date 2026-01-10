from django.shortcuts import render, redirect
from django.http import JsonResponse
from .ai_graph import agents, AGENT_ORDER


# -------------------------------------------------
# STARTUP FORM PAGE
# -------------------------------------------------
def startup_page(request):
    if request.method == "POST":
        request.session["startup_data"] = {
            "idea": request.POST.get("idea"),
            "problem": request.POST.get("problem"),
            "targets": request.POST.getlist("targets"),
            "solution": request.POST.get("solution"),
            "business_type": request.POST.get("business_type"),
            "revenue": request.POST.get("revenue"),
            "uniqueness": request.POST.get("uniqueness"),
        }

        # reset any previous simulation
        request.session.pop("graph_state", None)

        return redirect("canvas")

    return render(request, "startup.html")


# -------------------------------------------------
# CANVAS PAGE
# -------------------------------------------------
def canvas(request):
    if "startup_data" not in request.session:
        return redirect("startup")
    return render(request, "canvas.html")


# -------------------------------------------------
# RUN ONE AGENT STEP (CORE LOGIC)
# -------------------------------------------------
def run_step(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    startup_data = request.session.get("startup_data")
    if not startup_data:
        return JsonResponse({"error": "No startup data"}, status=400)

    # -----------------------------
    # LOAD OR INITIALIZE STATE
    # -----------------------------
    state = request.session.get("graph_state")

    if not isinstance(state, dict):
        state = {}

    # 🔒 FORCE SAFE STATE SHAPE
    state.setdefault("idea", startup_data["idea"])
    state.setdefault("current_message", startup_data["problem"])
    state.setdefault("history", [])
    state.setdefault("step", 0)

    # -----------------------------
    # STOP CONDITION
    # -----------------------------
    if state["step"] >= len(AGENT_ORDER):
        return JsonResponse({"done": True})

    # -----------------------------
    # RUN CURRENT AGENT
    # -----------------------------
    agent_name = AGENT_ORDER[state["step"]]
    agent_fn = agents[agent_name]

    state = agent_fn(state)

    # -----------------------------
    # MOVE TO NEXT AGENT
    # -----------------------------
    state["step"] += 1
    request.session["graph_state"] = dict(state)
    request.session.modified = True

    latest = state["history"][-1]

    return JsonResponse({
        "agent": latest["agent"],
        "output": latest["output"],
        "done": state["step"] >= len(AGENT_ORDER)
    })


# -------------------------------------------------
# FINAL SCORE (OPTIONAL – AFTER ALL AGENTS)
# -------------------------------------------------
def finalize_simulation(request):
    state = request.session.get("graph_state")
    if not state or "history" not in state:
        return JsonResponse({"error": "No simulation found"}, status=400)

    agents_data = state["history"]

    positive_words = [
        "clear", "simple", "easy", "focus", "feasible",
        "low cost", "trust", "real", "safe", "scalable", "useful"
    ]

    weights = {
        "Customer": 1.5,
        "CEO": 1.2,
        "Marketing": 1.0,
        "Finance": 1.0,
        "Tech": 0.8,
    }

    total = 0
    max_total = 0

    for a in agents_data:
        text = a["output"].lower()
        weight = weights.get(a["agent"], 1)
        score = min(sum(2 for w in positive_words if w in text), 20)
        total += score * weight
        max_total += 20 * weight

    success = round((total / max_total) * 100) if max_total else 0
    failure = 100 - success

    return JsonResponse({
        "success": success,
        "failure": failure,
        "agents": agents_data
    })
