import string
import random

def generate_password(length: int) -> str:
    if length <= 8:
        raise ValueError("Password should be longer than 8 characters!")
    chars = string.ascii_letters + string.digits + "!()"
    return ''.join(random.choice(chars) for _ in range(length))

def main():
    try:
        length = int(input("Enter Password Length: "))
        password = generate_password(length)
        print("Your Generated Password is:", password)
    except ValueError as e:
        print(e)

if __name__ == "__main__":
    main()