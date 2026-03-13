from manim import *

class SineCurveUnitCircle(Scene):
    def construct(self):
        self.show_axis()
        self.show_circle()
        self.move_dot_and_draw_curve()
        self.wait()

    def show_axis(self):
        x_axis = Line(np.array([-6, 0, 0]), np.array([6, 0, 0]))
        y_axis = Line(np.array([-4, -2, 0]), np.array([-4, 2, 0]))
        self.add(x_axis, y_axis)
        self.add_x_labels()
        self.origin_point = np.array([-4, 0, 0])
        self.curve_start = np.array([-3, 0, 0])

    def add_x_labels(self):
        x_labels = [
            MathTex("\pi"), MathTex("2 \pi"),
            MathTex("3 \pi"), MathTex("4 \pi")
        ]
        for i, label in enumerate(x_labels):
            label.next_to(np.array([-1 + 2 * i, 0, 0]), DOWN)
            self.add(label)

    def show_circle(self):
        circle = Circle(radius=1).move_to(self.origin_point)
        self.add(circle)
        self.circle = circle

    def move_dot_and_draw_curve(self):
        dot = Dot(radius=0.08, color=YELLOW).move_to(self.circle.point_from_proportion(0))
        self.t_offset = 0
        rate = 0.25

        def go_around_circle(mob, dt):
            self.t_offset += dt * rate
            mob.move_to(self.circle.point_from_proportion(self.t_offset % 1))

        def get_line_to_circle():
            return Line(self.origin_point, dot.get_center(), color=BLUE)

        def get_line_to_curve():
            x = self.curve_start[0] + self.t_offset * 4
            y = dot.get_center()[1]
            return Line(dot.get_center(), np.array([x, y, 0]), color=YELLOW_A, stroke_width=2)

        self.curve = VGroup(Line(self.curve_start, self.curve_start))

        def get_curve():
            last_line = self.curve[-1]
            x = self.curve_start[0] + self.t_offset * 4
            y = dot.get_center()[1]
            new_line = Line(last_line.get_end(), np.array([x, y, 0]), color=YELLOW_D)
            self.curve.add(new_line)
            return self.curve

        dot.add_updater(go_around_circle)

        self.add(
            dot,
            self.circle,
            always_redraw(get_line_to_circle),
            always_redraw(get_line_to_curve),
            always_redraw(get_curve)
        )
        self.wait(8.5)
        dot.remove_updater(go_around_circle)