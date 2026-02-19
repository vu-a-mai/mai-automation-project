#!/usr/bin/env python3
"""Cross-platform setup script for automation project."""

import os
import sys
import subprocess
import shutil

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)


def get_venvActivate_script(venv_dir):
    """Get the activate script path based on OS."""
    if sys.platform == "win32":
        return os.path.join(venv_dir, "Scripts", "activate.bat")
    return os.path.join(venv_dir, "bin", "activate")


def get_python_cmd():
    """Get the appropriate python command."""
    return "python" if sys.platform == "win32" else "python3"


def setup_python(dir_name, name):
    """Setup Python environment with venv."""
    dir_path = os.path.join(PROJECT_ROOT, "automation", "python", dir_name)
    venv_dir = os.path.join(dir_path, "venv")
    
    print(f"Setting up {name}...")
    
    if not os.path.exists(venv_dir):
        print(f"  Creating virtual environment...")
        subprocess.run([get_python_cmd(), "-m", "venv", venv_dir], check=True)
    else:
        print(f"  Virtual environment already exists")
    
    pip_exe = os.path.join(venv_dir, "bin", "pip") if sys.platform != "win32" else os.path.join(venv_dir, "Scripts", "pip")
    
    print(f"  Installing dependencies...")
    subprocess.run([pip_exe, "install", "--upgrade", "pip", "-q"], check=True)
    subprocess.run([pip_exe, "install", "-r", os.path.join(dir_path, "requirements.txt"), "-q"], check=True)
    
    if dir_name == "robotframework":
        playwright_exe = os.path.join(venv_dir, "bin", "python") if sys.platform != "win32" else os.path.join(venv_dir, "Scripts", "python")
        print(f"  Installing Playwright browsers...")
        subprocess.run([playwright_exe, "-m", "playwright", "install", "chromium"], check=True)
    
    print(f"  ✓ Complete\n")


def setup_typescript():
    """Setup TypeScript environment."""
    dir_path = os.path.join(PROJECT_ROOT, "automation", "typescript")
    print("Setting up TypeScript Playwright...")
    
    if not os.path.exists(os.path.join(dir_path, "node_modules")):
        print(f"  Installing npm dependencies...")
        subprocess.run(["npm", "install"], cwd=dir_path, check=True)
    else:
        print(f"  node_modules already exists")
    
    print(f"  Installing Playwright browsers...")
    try:
        subprocess.run(["npx", "playwright", "install", "chromium", "firefox", "webkit"], cwd=dir_path, check=True)
    except subprocess.CalledProcessError:
        subprocess.run(["npm", "exec", "playwright", "install", "chromium", "firefox", "webkit"], cwd=dir_path, check=True)
    print(f"  ✓ Complete\n")


def main():
    print("=== Automation Project Setup ===\n")
    print("1. Python Playwright (pytest)")
    print("2. Python Robot Framework")
    print("3. TypeScript Playwright")
    print("4. All of the above")
    print()
    
    choice = input("Select option (1-4): ").strip()
    
    if choice == "1":
        setup_python("playwright", "playwright-pytest")
    elif choice == "2":
        setup_python("robotframework", "robotframework")
    elif choice == "3":
        setup_typescript()
    elif choice == "4":
        setup_python("playwright", "playwright-pytest")
        setup_python("robotframework", "robotframework")
        setup_typescript()
        print("=== All complete! ===")
    else:
        print("Invalid option")
        sys.exit(1)


if __name__ == "__main__":
    main()
