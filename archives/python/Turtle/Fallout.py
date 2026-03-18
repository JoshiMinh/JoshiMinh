from turtle import *

setup(700, 700)
speed(0)
bgcolor("Gold")

def silentMove(x, y):
    penup()
    goto(x, y)
    pendown()

silentMove(0, -300)
color("black")
begin_fill()
circle(300)
end_fill()

color("gold")
silentMove(0, 0)
for i in range(3):
    left(120)
    begin_fill()
    for x in range(3):
        forward(290)
        right(120)
    end_fill()

hideturtle()
exitonclick()