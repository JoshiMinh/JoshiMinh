from turtle import *

bgcolor("black")
color("Yellow")
speed(0)
penup()
goto(-150,0)
pendown()

begin_fill()
for i in range(5):
    forward(250)
    left(144)
end_fill()

hideturtle()
exitonclick()