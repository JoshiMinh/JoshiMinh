from turtle import *

setup(700, 650)
bgcolor("black")
speed(7)
pensize(5)

penup()
goto(-75, 100)
pendown()
color("red")
for i in range(4):
    forward(150)
    right(90)

penup()
goto(125, 100)
pendown()
for i in ["red","yellow","green","blue"]:
    color(i)
    forward(150)
    right(90)

penup()
goto(-275, 100)
pendown()
color("green", "lightgreen")
begin_fill()
for i in range(4):
    forward(150)
    right(90)
end_fill()

hideturtle()
exitonclick()