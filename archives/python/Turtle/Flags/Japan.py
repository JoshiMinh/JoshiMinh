from turtle import *

speed(5)
setup(800, 500)

penup()
goto(0, -100)
pendown()

color("red")
begin_fill()
circle(120)
end_fill()

hideturtle()
exitonclick()