import subprocess
import os

def run_command(command):
    process = subprocess.run(["powershell", "-Command", command], capture_output=True, text=True)
    if process.stdout:
        print(process.stdout)
    if process.stderr:
        print(process.stderr)

def main():
    print("Python PowerShell! Type 'exit' to quit.")
    
    while True:
        command = input(">> ")
        if command.lower() in ['exit', 'quit']:
            break
        if command.startswith('cd '):
            try:
                os.chdir(command[3:])
            except FileNotFoundError as e:
                print(e)
            continue
        run_command(command)

if __name__ == "__main__":
    main()