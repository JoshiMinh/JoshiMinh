from turtle import *

setup(800, 500)
speed(0)
bgcolor("yellow")

penup()
goto(-400,-250)
pendown()

color("royalblue")

begin_fill()
forward(800)
left(90)
forward(250)
left(90)
forward(800)
left(90)
forward(250)
end_fill()

hideturtle()
exitonclick()