import colorama
import math
import sys

colorama.init(autoreset=True)

def progress_bar(progress, total, color=colorama.Fore.YELLOW, bar_length=50):
    percent = 100 * (progress / float(total))
    filled_length = int(bar_length * progress // total)
    bar = '|' * filled_length + '-' * (bar_length - filled_length)
    sys.stdout.write(color + f"\r|{bar}| {percent:.2f}%")
    sys.stdout.flush()
    if progress == total:
        sys.stdout.write(colorama.Fore.GREEN + f"\r|{bar}| {percent:.2f}%\n")
        sys.stdout.flush()

def main():
    numbers = [x * 5 for x in range(2000, 3000)]
    results = []

    progress_bar(0, len(numbers))

    for i, x in enumerate(numbers, 1):
        results.append(math.factorial(x))
        progress_bar(i, len(numbers))

if __name__ == "__main__":
    main()