from manim import *

class ThreeDSceneSphere(ThreeDScene):
    def construct(self):
        self.renderer.camera.light_source.move_to(3 * IN)
        self.set_camera_orientation(phi=75 * DEGREES, theta=30 * DEGREES)
        self.add(ThreeDAxes(), Surface(
            lambda u, v: np.array([
                1.5 * np.cos(u) * np.cos(v),
                1.5 * np.cos(u) * np.sin(v),
                1.5 * np.sin(u)
            ]), v_range=[0, TAU], u_range=[-PI / 2, PI / 2],
            checkerboard_colors=[RED_D, RED_E], resolution=(15, 32)
        ))
        self.begin_ambient_camera_rotation(0.1)
        self.wait(5)
        self.stop_ambient_camera_rotation()
        self.move_camera(phi=75 * DEGREES, theta=30 * DEGREES)
        self.wait(2)
        self.begin_3dillusion_camera_rotation(2)
        self.wait(PI / 2)
        self.stop_3dillusion_camera_rotation()