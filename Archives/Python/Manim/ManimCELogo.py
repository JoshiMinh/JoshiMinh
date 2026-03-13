from manim import *

class ManimCELogo(Scene):
    def construct(self):
        self.camera.background_color = "#ece6e2"

        colors = {
            "green": "#87c2a5",
            "blue": "#525893",
            "red": "#e07a5f",
            "black": "#343434"
        }

        ds_m = MathTex(r"\mathbb{M}", fill_color=colors["black"]).scale(7)
        ds_m.shift(2.25 * LEFT + 1.5 * UP)

        circle = Circle(color=colors["green"], fill_opacity=1).shift(LEFT)
        square = Square(color=colors["blue"], fill_opacity=1).shift(UP)
        triangle = Triangle(color=colors["red"], fill_opacity=1).shift(RIGHT)

        logo = VGroup(triangle, square, circle, ds_m).move_to(ORIGIN)
        self.add(logo)