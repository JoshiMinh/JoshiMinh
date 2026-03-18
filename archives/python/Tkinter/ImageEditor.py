import tkinter as tk
from tkinter import filedialog, colorchooser, ttk
from PIL import Image, ImageOps, ImageTk, ImageFilter

root = tk.Tk()
root.geometry("1000x600")
root.title("Image Drawing Tool")
root.config(bg="white")

pen_color = "black"
pen_size = 5
file_path = ""

# Function to add image
def add_image():
    global file_path
    file_path = filedialog.askopenfilename(initialdir="D:/codefirst.io/Tkinter Image Editor/Pictures")
    image = Image.open(file_path)
    width, height = int(image.width / 2), int(image.height / 2)
    canvas.config(width=image.width, height=image.height)
    image = ImageTk.PhotoImage(image)
    canvas.image = image
    canvas.create_image(0, 0, image=image, anchor="nw")

# Function to change pen color
def change_color():
    global pen_color
    pen_color = colorchooser.askcolor(title="Select Pen Color")[1]

# Function to change pen size
def change_size(size):
    global pen_size
    pen_size = size

# Function to draw on canvas
def draw(event):
    x1, y1 = (event.x - pen_size), (event.y - pen_size)
    x2, y2 = (event.x + pen_size), (event.y + pen_size)
    canvas.create_oval(x1, y1, x2, y2, fill=pen_color, outline='')

# Function to clear canvas
def clear_canvas():
    canvas.delete("all")
    canvas.create_image(0, 0, image=canvas.image, anchor="nw")

# Function to apply filter to the image
def apply_filter(filter):
    image = Image.open(file_path)
    width, height = int(image.width / 2), int(image.height / 2)
    if filter == "Black and White":
        image = ImageOps.grayscale(image)
    elif filter == "Blur":
        image = image.filter(ImageFilter.BLUR)
    elif filter == "Sharpen":
        image = image.filter(ImageFilter.SHARPEN)
    elif filter == "Smooth":
        image = image.filter(ImageFilter.SMOOTH)
    elif filter == "Emboss":
        image = image.filter(ImageFilter.EMBOSS)
    image = ImageTk.PhotoImage(image)
    canvas.image = image
    canvas.create_image(0, 0, image=image, anchor="nw")

# Left frame
left_frame = tk.Frame(root, width=200, height=600, bg="white")
left_frame.pack(side="left", fill="y")

# Canvas
canvas = tk.Canvas(root, width=750, height=600)
canvas.pack()

# Buttons and widgets
image_button = tk.Button(left_frame, text="Add Image", command=add_image, bg="white")
image_button.pack(pady=15)

color_button = tk.Button(left_frame, text="Change Pen Color", command=change_color, bg="white")
color_button.pack(pady=5)

pen_size_frame = tk.Frame(left_frame, bg="white")
pen_size_frame.pack(pady=5)

pen_sizes = [(3, "Small"), (5, "Medium"), (7, "Large")]
for size, text in pen_sizes:
    pen_size_button = tk.Radiobutton(pen_size_frame, text=text, value=size, command=lambda s=size: change_size(s), bg="white")
    pen_size_button.pack(side="left")
    if size == pen_size:  # Select the default pen size
        pen_size_button.select()

clear_button = tk.Button(left_frame, text="Clear", command=clear_canvas, bg="Red")
clear_button.pack(pady=10)

filter_label = tk.Label(left_frame, text="Select Filter", bg="white")
filter_label.pack()
filter_combobox = ttk.Combobox(left_frame, values=["Black and White", "Blur", "Emboss", "Sharpen", "Smooth"])
filter_combobox.pack()

filter_combobox.bind("<<ComboboxSelected>>", lambda event: apply_filter(filter_combobox.get()))

# Event bindings
canvas.bind("<B1-Motion>", draw)

root.mainloop()