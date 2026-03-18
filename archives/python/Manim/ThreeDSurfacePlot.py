from manim import *

class ThreeDSurfacePlot(ThreeDScene):
    def construct(self):
        resolution_fa = 24
        self.set_camera_orientation(phi=75 * DEGREES, theta=-30 * DEGREES)

        def param_gauss(u, v):
            x, y = u, v
            sigma, mu = 0.4, [0.0, 0.0]
            d = np.linalg.norm([x - mu[0], y - mu[1]])
            z = np.exp(-(d**2 / (2.0 * sigma**2)))
            return np.array([x, y, z])

        gauss_plane = Surface(
            param_gauss,
            resolution=(resolution_fa, resolution_fa),
            v_range=[-2, 2],
            u_range=[-2, 2]
        ).scale(2).set_style(fill_opacity=1, stroke_color=GREEN).set_fill_by_checkerboard(ORANGE, BLUE, opacity=0.5)

        self.add(ThreeDAxes(), gauss_plane)
        self.begin_ambient_camera_rotation(rate=0.5)
        self.wait(5)
        self.stop_ambient_camera_rotation()