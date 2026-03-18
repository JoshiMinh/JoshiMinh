import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk
import os

def show_image():
    filename = filedialog.askopenfilename(initialdir=os.getcwd(), title="Select image file", filetype=(("JPG File", "*.jpg"), ("PNG File", "*.png")))
    if filename:
        img = ImageTk.PhotoImage(Image.open(filename))
        lbl.configure(image=img)
        lbl.image = img

#Root Window
root = tk.Tk()
root.title("Image Viewer")
root.geometry("400x450")

frame = tk.Frame(root)
frame.pack(side=tk.BOTTOM, padx=15, pady=15)

#Componennts
lbl = tk.Label(root)
lbl.pack()

btn = tk.Button(frame, text="Select Image", command=show_image)
btn.pack(side=tk.LEFT)

exit_btn = tk.Button(frame, text="Quit", command=quit)
exit_btn.pack(side=tk.LEFT, padx=8)

root.mainloop()