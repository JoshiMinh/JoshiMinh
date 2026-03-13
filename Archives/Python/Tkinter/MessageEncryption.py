from tkinter import *
from tkinter import messagebox
import base64
import os

def display_window(title, message):
    window = Toplevel(root)
    window.title(title)
    window.geometry("400x200")
    window.configure(bg="#00bd56" if title == "Decryption" else "#ed3833")

    Label(window, text=title.upper(), font="Arial", fg="white", bg="#00bd56" if title == "Decryption" else "#ed3833").place(x=10, y=0)
    text_output = Text(window, font="Arial 10", bg="white", relief=GROOVE, wrap=WORD, bd=0)
    text_output.place(x=10, y=40, width=380, height=150)
    text_output.insert(END, message)

def decrypt():
    message = text_input.get(1.0, END).strip()
    try:
        decoded_message = base64.b64decode(message.encode("ascii")).decode("ascii")
        display_window("Decryption", decoded_message)
    except:
        messagebox.showerror("Decryption", "Invalid data")

def encrypt():
    message = text_input.get(1.0, END).strip()
    if not message:
        messagebox.showerror("Encryption", "Enter text to encrypt")
        return
    encoded_message = base64.b64encode(message.encode("ascii")).decode("ascii")
    display_window("Encryption", encoded_message)

def reset():
    text_input.delete(1.0, END)

root = Tk()
root.geometry("375x400")
root.title("MessageEncryptor")

image_dir = r"C:\Users\Acer\My Drive (binhangia241273@gmail.com)\Project Files\Coding Projects\Python Mini Projects\Tkinter\Images"
icon_path = os.path.join(image_dir, "key.ico")
root.iconbitmap(icon_path)

Label(text="Enter text for encryption and decryption", fg="black", font=("Calibri", 13)).place(x=10, y=10)
text_input = Text(font="Arial 20", bg="white", relief=GROOVE, wrap=WORD, bd=0)
text_input.place(x=10, y=50, width=355, height=100)

Button(text="ENCRYPT", height="2", width=23, bg="#ed3833", fg="white", bd=0, command=encrypt).place(x=10, y=170)
Button(text="DECRYPT", height="2", width=23, bg="#00bd56", fg="white", bd=0, command=decrypt).place(x=200, y=170)
Button(text="RESET", height="2", width=50, bg="#1089ff", fg="white", bd=0, command=reset).place(x=10, y=220)

root.mainloop()