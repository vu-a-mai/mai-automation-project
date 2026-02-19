#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

setup_python() {
    local dir="$1"
    local name="$2"
    local venv_dir="$dir/venv"
    
    echo "Setting up $name..."
    
    if [ -d "$venv_dir" ]; then
        echo "  Virtual environment already exists"
    else
        echo "  Creating virtual environment..."
        python3 -m venv "$venv_dir"
    fi
    
    source "$venv_dir/bin/activate"
    pip install --upgrade pip -q
    pip install -r "$dir/requirements.txt" -q
    
    if [ "$name" = "robotframework" ]; then
        python -m playwright install chromium firefox webkit --with-deps 2>/dev/null || python -m playwright install chromium firefox webkit
    fi
    
    deactivate 2>/dev/null || true
    echo "  ✓ Complete"
}

setup_typescript() {
    local dir="$1"
    
    echo "Setting up TypeScript Playwright..."
    
    if [ -d "$dir/node_modules" ]; then
        echo "  node_modules already exists"
    else
        cd "$dir"
        npm install
    fi
    
    npx playwright install chromium firefox webkit 2>/dev/null || true
    echo "  ✓ Complete"
}

setup_all() {
    echo "=== Setting up all environments ==="
    setup_python "$PROJECT_ROOT/automation/python/playwright" "playwright-pytest"
    setup_python "$PROJECT_ROOT/automation/python/robotframework" "robotframework"
    setup_typescript "$PROJECT_ROOT/automation/typescript"
    echo "=== All complete! ==="
}

while true; do
    echo ""
    echo "=== Automation Project Setup ==="
    echo "1. Python Playwright (pytest)"
    echo "2. Python Robot Framework"
    echo "3. TypeScript Playwright"
    echo "4. All of the above"
    echo "5. Exit"
    echo ""
    
    read -p "Select option (1-5): " choice
    
    case $choice in
        1)
            setup_python "$PROJECT_ROOT/automation/python/playwright" "playwright-pytest"
            ;;
        2)
            setup_python "$PROJECT_ROOT/automation/python/robotframework" "robotframework"
            ;;
        3)
            setup_typescript "$PROJECT_ROOT/automation/typescript"
            ;;
        4)
            setup_all
            ;;
        5)
            echo "Goodbye!"
            break
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
