import sympy as sp

x, y = sp.symbols('x y')
u = sp.Function('u')(x, y)

pde = sp.Eq(x * sp.diff(u, x) - 3 * y * sp.diff(u, y), 2 * x**2 * u)

solution = sp.pdsolve(pde)

print(solution)