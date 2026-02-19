#!/usr/bin/env python3
"""Cross-platform test runner script."""

import os
import sys
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)


def get_venv_python(venv_dir):
    """Get the Python executable path from venv."""
    if sys.platform == "win32":
        return os.path.join(venv_dir, "Scripts", "python")
    return os.path.join(venv_dir, "bin", "python")


def run_robot():
    """Run Robot Framework tests."""
    dir_path = os.path.join(PROJECT_ROOT, "automation", "python", "robotframework")
    venv_dir = os.path.join(dir_path, "venv")
    
    os.chdir(dir_path)
    os.environ["PYTHONPATH"] = dir_path
    
    if os.path.exists(venv_dir):
        python_exe = get_venv_python(venv_dir)
        subprocess.run([python_exe, "-m", "robot", "--outputdir", "results", "tests/"])
    else:
        subprocess.run(["robot", "--outputdir", "results", "tests/"])


def run_pytest():
    """Run pytest tests."""
    dir_path = os.path.join(PROJECT_ROOT, "automation", "python", "playwright")
    venv_dir = os.path.join(dir_path, "venv")
    
    os.chdir(dir_path)
    
    if os.path.exists(venv_dir):
        python_exe = get_venv_python(venv_dir)
        subprocess.run([python_exe, "-m", "pytest", "-v", "--html=results/report.html", "--self-contained-html"])
    else:
        subprocess.run(["pytest", "-v", "--html=results/report.html", "--self-contained-html"])


def run_typescript():
    """Run TypeScript Playwright tests."""
    dir_path = os.path.join(PROJECT_ROOT, "automation", "typescript")
    os.chdir(dir_path)
    subprocess.run(["npm", "test"])


def run_all():
    """Run all tests."""
    print("\n" + "="*50)
    print("Running: Python Robot Framework")
    print("="*50 + "\n")
    run_robot()
    
    print("\n" + "="*50)
    print("Running: Python pytest")
    print("="*50 + "\n")
    run_pytest()
    
    print("\n" + "="*50)
    print("Running: TypeScript Playwright")
    print("="*50 + "\n")
    run_typescript()


def main():
    while True:
        print("\n=== Run Tests ===")
        print("1. Python Robot Framework")
        print("2. Python pytest (Playwright)")
        print("3. TypeScript Playwright")
        print("4. Run All")
        print("5. Exit")
        print()
        
        choice = input("Select option (1-5): ").strip()
        
        if choice == "1":
            run_robot()
        elif choice == "2":
            run_pytest()
        elif choice == "3":
            run_typescript()
        elif choice == "4":
            run_all()
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid option")


if __name__ == "__main__":
    main()
