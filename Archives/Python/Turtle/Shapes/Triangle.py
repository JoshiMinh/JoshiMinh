from turtle import *

speed(7)
setup(800, 500)

penup()
goto(-150,-100)
pendown()
fillcolor("red")

begin_fill()
for i in range(3):
    forward(300)
    left(120)
end_fill()

hideturtle()
exitonclick()