from manim import *

class Intro(Scene):
    def construct(self):
        circle = Circle(2, color=RED, fill_opacity=0.1)
        title = Text("Manim", font_size=72, slant=ITALIC).shift(UP * 0.3)
        subtitle = Text("Basics", slant=ITALIC).shift(DOWN * 0.5)
        arc = Arc(2.2, TAU / 4, -TAU * 0.65, color=BLUE, stroke_width=15)

        self.play(DrawBorderThenFill(circle, run_time=0.5), Write(title), Write(subtitle), Create(arc))
        self.wait(3)