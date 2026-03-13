from tkinter import *
from PIL import ImageTk, Image
import os

root = Tk()
root.title("DarkTheme")
root.geometry("400x450")
root.config(bg="White")

button_mode = True

# Path to the directory containing the image files
image_dir = r"C:\Users\Acer\My Drive (binhangia241273@gmail.com)\Project Files\Coding Projects\Python Mini Projects\Tkinter\Images"

on = ImageTk.PhotoImage(Image.open(os.path.join(image_dir, "light.png")))
off = ImageTk.PhotoImage(Image.open(os.path.join(image_dir, "dark.png")))

def toggle_theme():
    global button_mode
    if button_mode:
        btn.config(image=off, bg="Black", activebackground="Black")
        root.config(bg="Black")
        button_mode = False
    else:
        btn.config(image=on, bg="White", activebackground="White")
        root.config(bg="White")
        button_mode = True

btn = Button(root, image=on, bd=0, bg="White", activebackground="White", command=toggle_theme)
btn.pack(padx=50, pady=50)

root.mainloop()