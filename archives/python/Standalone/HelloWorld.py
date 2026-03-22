import time

s = "Hello World"
r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#1234567890$%^&"
e = ""

for char in s:
    for candidate in r:
        print(e + candidate)
        time.sleep(0.025)
        if candidate == char:
            e += char
            break