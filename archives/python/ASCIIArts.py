import pyfiglet

def create_ascii_art(text, font):
    try:
        return pyfiglet.Figlet(font=font).renderText(text)
    except pyfiglet.FontNotFound:
        return f"Font '{font}' not found. Choose a valid font."

user_text = input("Text for ASCII art: ")

fonts = ['standard', 'slant', '3-d', '5lineoblique', 'banner3-D']
print("Choose a font:")
for i, font in enumerate(fonts, 1):
    print(f"{i}. {font}")

font_choice = int(input("Font number: "))
ascii_art = create_ascii_art(user_text, fonts[font_choice - 1])
print(ascii_art)