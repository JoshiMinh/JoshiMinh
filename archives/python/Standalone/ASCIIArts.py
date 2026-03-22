import pyfiglet

def create_ascii_art(text, font):
    try:
        figlet = pyfiglet.Figlet(font=font)
        return figlet.renderText(text)
    except pyfiglet.FontNotFound:
        return f"Font '{font}' not found. Please choose a valid font."

def main():
    user_text = input("Enter text for ASCII art: ").strip()
    fonts = ['standard', 'slant', '3-d', '5lineoblique', 'banner3-D']

    print("\nAvailable Fonts:")
    for idx, font in enumerate(fonts, 1):
        print(f"  {idx}. {font}")

    while True:
        try:
            choice = int(input("Select font number: "))
            if 1 <= choice <= len(fonts):
                break
            print(f"Please enter a number between 1 and {len(fonts)}.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    ascii_art = create_ascii_art(user_text, fonts[choice - 1])
    print("\n" + ascii_art)

if __name__ == "__main__":
    main()