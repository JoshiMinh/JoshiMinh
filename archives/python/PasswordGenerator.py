from random import choice

alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!()'
leng = int(input("Enter Password Length: "))

if leng > 8:
    pwd = ''.join(choice(alpha) for _ in range(leng))
    print("Your Generated Password is:", pwd)
else:
    print("Password should be longer than 8 characters!")