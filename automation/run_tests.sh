#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

run_robot() {
    local dir="$PROJECT_ROOT/automation/python/robotframework"
    cd "$dir"
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    export PYTHONPATH="$dir"
    robot --outputdir results tests/
    deactivate 2>/dev/null || true
}

run_pytest() {
    local dir="$PROJECT_ROOT/automation/python/playwright"
    cd "$dir"
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    pytest -v
    deactivate 2>/dev/null || true
}

run_typescript() {
    local dir="$PROJECT_ROOT/automation/typescript"
    cd "$dir"
    npm test
}

run_all() {
    echo ""
    echo "=================================================="
    echo "Running: Python Robot Framework"
    echo "=================================================="
    run_robot
    
    echo ""
    echo "=================================================="
    echo "Running: Python pytest"
    echo "=================================================="
    run_pytest
    
    echo ""
    echo "=================================================="
    echo "Running: TypeScript Playwright"
    echo "=================================================="
    run_typescript
}

while true; do
    echo ""
    echo "=== Run Tests ==="
    echo "1. Python Robot Framework"
    echo "2. Python pytest (Playwright)"
    echo "3. TypeScript Playwright"
    echo "4. Run All"
    echo "5. Exit"
    echo ""
    
    read -p "Select option (1-5): " choice
    
    case $choice in
        1) run_robot ;;
        2) run_pytest ;;
        3) run_typescript ;;
        4) run_all ;;
        5) 
            echo "Goodbye!"
            break
            ;;
        *) echo "Invalid option" ;;
    esac
done
