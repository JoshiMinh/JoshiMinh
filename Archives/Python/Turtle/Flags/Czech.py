from turtle import *

setup(800, 500)
speed(0)

def drawHalfScreen(name):
    color(name)
    begin_fill()
    pendown()
    forward(800)
    right(90)
    forward(250)
    right(90)
    forward(800)
    right(90)
    forward(250)
    right(90)
    end_fill()

penup()
goto(-400,250)
drawHalfScreen("white")
penup()
goto(-400,0)
drawHalfScreen("red")

penup()
goto(-400,250)
color("navy")
pendown()
begin_fill()
goto(-100,0)
goto(-400,-250)
goto(-400,250)
end_fill()

hideturtle()
exitonclick()