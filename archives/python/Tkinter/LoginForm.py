import tkinter
from tkinter import messagebox

window = tkinter.Tk()
window.title("Login form")
window.geometry('550x400')
window.configure(bg="#333333")

frame = tkinter.Frame(bg="#333333")

def auth():
    username = "admin"
    password = "Fuckyou"
    if Username_entry.get() == username and Password_entry.get() == password:
        messagebox.showinfo(title="Login Successfully", message="Login Successfully!")
    else:
        messagebox.showerror(title="Login Unsuccessful", message="Fuck You!")

# Defining Components
Log_label = tkinter.Label(frame, text="Login", bg="#333333", fg='#FFFFFF', font=("Arial", 20))
Username_label = tkinter.Label(frame, text="Username", bg="#333333", fg='#FFFFFF', font=("Arial", 15))
Password_label = tkinter.Label(frame, text="Password", bg="#333333", fg='#FFFFFF', font=("Arial", 15))

Username_entry = tkinter.Entry(frame)
Password_entry = tkinter.Entry(frame, show="*")

Login = tkinter.Button(frame, text="Login", bg="Red", fg='#FFFFFF', font=("Arial", 15),command=auth)

#Placing Components
Log_label.grid(row=0, column=0, columnspan=2, pady=15)
Username_label.grid(row=1, column=0)
Password_label.grid(row=2, column=0)

Username_entry.grid(row=1, column=1)
Password_entry.grid(row=2, column=1)

Login.grid(row=3, column=0, columnspan=2, pady=15)
frame.pack()

#Run the Loop
window.eval('tk::PlaceWindow . center')
window.mainloop()