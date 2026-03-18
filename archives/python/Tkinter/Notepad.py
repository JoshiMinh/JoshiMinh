from tkinter import *
from tkinter import filedialog

root = Tk()
root.title("Text Editor")
root.geometry("800x600")
root.config(bg='#F5F5F5')

def save_file():
    open_file = filedialog.asksaveasfile(mode='w', defaultextension='.txt')
    if open_file is not None:
        text = str(text_area.get(1.0, END))  # Get the text from the text area
        open_file.write(text)
        open_file.close()

def open_file():
    file = filedialog.askopenfile(mode='r', filetype=[('Text Files', '*.txt')])
    if file is not None:
        content = file.read()
        text_area.insert(INSERT, content)
        file.close()

# Create the text area
text_area = Text(root, bg='#FFFFFF', fg='#333333', wrap=WORD)
text_area.pack(expand=True, fill=BOTH, padx=10, pady=10)

# Create a frame for the buttons
button_frame = Frame(root, bg='#F5F5F5')
button_frame.pack(side=BOTTOM, fill=X, padx=10, pady=5)

save_button = Button(button_frame, text="Save File", command=save_file, bg='#4CAF50', fg='#FFFFFF', padx=10, pady=5)
save_button.pack(side=LEFT, padx=5)

open_button = Button(button_frame, text="Open File", command=open_file, bg='#2196F3', fg='#FFFFFF', padx=10, pady=5)
open_button.pack(side=LEFT, padx=5)

root.mainloop()