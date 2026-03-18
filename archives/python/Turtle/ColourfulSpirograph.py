from turtle import *

speed(0)
setup(800, 800)
bgcolor("black")

colours = ["red", "purple", "blue", "green", "orange", "yellow"]

for i in range(360):
    color(colours[i%6])
    forward(i)
    left(59)
    
hideturtle()
exitonclick()