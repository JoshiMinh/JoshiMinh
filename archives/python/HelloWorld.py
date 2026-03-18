import time

s = "Hello World"
r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#1234567890$%^&"
e = ""

for i in range(len(s)):
    for j in r:
        time.sleep(0.025)
        print(e + j)
        if j == s[i]:
            e += s[i]
            break