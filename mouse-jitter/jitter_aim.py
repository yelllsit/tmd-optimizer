import tkinter as tk
from tkinter import ttk
import threading
import math
import time
import sys

try:
    from pynput.mouse import Controller as MouseController
    from pynput import keyboard
except ImportError:
    print("Missing dependency: run  pip install pynput")
    sys.exit(1)

DARK_BG = "#1a1a2e"
PANEL_BG = "#16213e"
ACCENT = "#e94560"
ACCENT_ON = "#00d4aa"
TEXT = "#eaeaea"
MUTED = "#8899aa"
SLIDER_BG = "#0f3460"


class JitterAimApp:
    def __init__(self):
        self.mouse = MouseController()
        self.active = False
        self._thread = None
        self._hotkey_listener = None

        self.root = tk.Tk()
        self.root.title("Jitter Aim – Apex")
        self.root.resizable(False, False)
        self.root.configure(bg=DARK_BG)
        self._build_ui()
        self._start_hotkey_listener()
        self.root.protocol("WM_DELETE_WINDOW", self._on_close)

    # ── UI ────────────────────────────────────────────────────────────────

    def _build_ui(self):
        root = self.root

        # ── Title bar ──────────────────────────────────────────────────
        title_frame = tk.Frame(root, bg=PANEL_BG, pady=8)
        title_frame.pack(fill="x")
        tk.Label(
            title_frame,
            text="🎯  JITTER AIM",
            font=("Segoe UI", 16, "bold"),
            bg=PANEL_BG,
            fg=ACCENT,
        ).pack()
        tk.Label(
            title_frame,
            text="Apex Legends recoil control",
            font=("Segoe UI", 9),
            bg=PANEL_BG,
            fg=MUTED,
        ).pack()

        # ── Status indicator ───────────────────────────────────────────
        status_frame = tk.Frame(root, bg=DARK_BG, pady=14)
        status_frame.pack(fill="x")

        self.status_dot = tk.Label(
            status_frame, text="●", font=("Segoe UI", 28), bg=DARK_BG, fg=ACCENT
        )
        self.status_dot.pack()
        self.status_label = tk.Label(
            status_frame,
            text="OFF",
            font=("Segoe UI", 13, "bold"),
            bg=DARK_BG,
            fg=ACCENT,
        )
        self.status_label.pack()
        tk.Label(
            status_frame,
            text="Press  F6  to toggle",
            font=("Segoe UI", 9),
            bg=DARK_BG,
            fg=MUTED,
        ).pack(pady=(4, 0))

        # ── Toggle button ──────────────────────────────────────────────
        btn_frame = tk.Frame(root, bg=DARK_BG, pady=4)
        btn_frame.pack()
        self.toggle_btn = tk.Button(
            btn_frame,
            text="  START  ",
            font=("Segoe UI", 11, "bold"),
            bg=ACCENT,
            fg="white",
            activebackground="#c73652",
            activeforeground="white",
            relief="flat",
            padx=20,
            pady=8,
            cursor="hand2",
            command=self.toggle,
        )
        self.toggle_btn.pack()

        sep = tk.Frame(root, height=1, bg=SLIDER_BG)
        sep.pack(fill="x", padx=16, pady=12)

        # ── Settings panel ─────────────────────────────────────────────
        settings = tk.Frame(root, bg=DARK_BG, padx=20)
        settings.pack(fill="x", pady=(0, 4))

        # Pattern
        self._label(settings, "PATTERN")
        self.pattern_var = tk.StringVar(value="circle")
        pattern_frame = tk.Frame(settings, bg=DARK_BG)
        pattern_frame.pack(fill="x", pady=(2, 10))
        for text, val in [("Circle", "circle"), ("Horizontal", "horizontal"), ("Figure-8", "figure8"), ("Random", "random")]:
            rb = tk.Radiobutton(
                pattern_frame,
                text=text,
                variable=self.pattern_var,
                value=val,
                bg=DARK_BG,
                fg=TEXT,
                selectcolor=SLIDER_BG,
                activebackground=DARK_BG,
                activeforeground=TEXT,
                font=("Segoe UI", 9),
            )
            rb.pack(side="left", padx=(0, 10))

        # Strength
        self._label(settings, "STRENGTH  (pixels)")
        self.strength_var = tk.IntVar(value=5)
        strength_row = tk.Frame(settings, bg=DARK_BG)
        strength_row.pack(fill="x", pady=(2, 10))
        strength_slider = ttk.Scale(
            strength_row,
            from_=1,
            to=15,
            orient="horizontal",
            variable=self.strength_var,
            command=lambda _: self.strength_val_lbl.config(text=str(self.strength_var.get())),
        )
        strength_slider.pack(side="left", fill="x", expand=True)
        self.strength_val_lbl = tk.Label(
            strength_row, text="5", width=3, bg=DARK_BG, fg=ACCENT_ON, font=("Segoe UI", 9, "bold")
        )
        self.strength_val_lbl.pack(side="left", padx=(6, 0))

        # Speed
        self._label(settings, "SPEED  (Hz)")
        self.speed_var = tk.IntVar(value=60)
        speed_row = tk.Frame(settings, bg=DARK_BG)
        speed_row.pack(fill="x", pady=(2, 10))
        speed_slider = ttk.Scale(
            speed_row,
            from_=20,
            to=120,
            orient="horizontal",
            variable=self.speed_var,
            command=lambda _: self.speed_val_lbl.config(text=str(self.speed_var.get())),
        )
        speed_slider.pack(side="left", fill="x", expand=True)
        self.speed_val_lbl = tk.Label(
            speed_row, text="60", width=3, bg=DARK_BG, fg=ACCENT_ON, font=("Segoe UI", 9, "bold")
        )
        self.speed_val_lbl.pack(side="left", padx=(6, 0))

        # ── Info bar ───────────────────────────────────────────────────
        sep2 = tk.Frame(root, height=1, bg=SLIDER_BG)
        sep2.pack(fill="x", padx=16, pady=8)

        info = tk.Frame(root, bg=PANEL_BG, pady=8, padx=16)
        info.pack(fill="x")
        tk.Label(
            info,
            text="Hold fire in-game while jitter is ON.\nKeep strength 3-7 px for best results.",
            font=("Segoe UI", 8),
            bg=PANEL_BG,
            fg=MUTED,
            justify="left",
        ).pack(anchor="w")

        root.geometry("340x520")
        self._apply_ttk_style()

    def _label(self, parent, text):
        tk.Label(
            parent, text=text, font=("Segoe UI", 8, "bold"), bg=DARK_BG, fg=MUTED
        ).pack(anchor="w")

    def _apply_ttk_style(self):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure(
            "Horizontal.TScale",
            background=DARK_BG,
            troughcolor=SLIDER_BG,
            sliderlength=18,
            sliderrelief="flat",
        )

    # ── Jitter engine ──────────────────────────────────────────────────

    def _jitter_loop(self):
        t = 0.0
        while self.active:
            strength = self.strength_var.get()
            hz = max(1, self.speed_var.get())
            pattern = self.pattern_var.get()
            interval = 1.0 / hz

            if pattern == "circle":
                dx = int(strength * math.cos(t))
                dy = int(strength * math.sin(t))
                t += 0.6
            elif pattern == "horizontal":
                dx = strength if (int(t) % 2 == 0) else -strength
                dy = 0
                t += 1
            elif pattern == "figure8":
                dx = int(strength * math.sin(t))
                dy = int(strength * math.sin(2 * t) * 0.5)
                t += 0.5
            else:  # random
                import random
                dx = random.randint(-strength, strength)
                dy = random.randint(-strength, strength)

            self.mouse.move(dx, dy)
            time.sleep(interval)

    # ── Toggle ─────────────────────────────────────────────────────────

    def toggle(self):
        if self.active:
            self.active = False
            self._update_status(False)
        else:
            self.active = True
            self._update_status(True)
            self._thread = threading.Thread(target=self._jitter_loop, daemon=True)
            self._thread.start()

    def _update_status(self, on: bool):
        if on:
            self.status_dot.config(fg=ACCENT_ON)
            self.status_label.config(text="ON", fg=ACCENT_ON)
            self.toggle_btn.config(text="  STOP  ", bg="#1a6b57")
        else:
            self.status_dot.config(fg=ACCENT)
            self.status_label.config(text="OFF", fg=ACCENT)
            self.toggle_btn.config(text="  START  ", bg=ACCENT)

    # ── Hotkey (F6) ────────────────────────────────────────────────────

    def _start_hotkey_listener(self):
        def on_press(key):
            if key == keyboard.Key.f6:
                self.root.after(0, self.toggle)

        self._hotkey_listener = keyboard.Listener(on_press=on_press)
        self._hotkey_listener.daemon = True
        self._hotkey_listener.start()

    # ── Lifecycle ──────────────────────────────────────────────────────

    def _on_close(self):
        self.active = False
        if self._hotkey_listener:
            self._hotkey_listener.stop()
        self.root.destroy()

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    JitterAimApp().run()
