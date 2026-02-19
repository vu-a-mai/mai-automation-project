#!/bin/bash
# Run Robot Framework tests on Linux/Mac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -d "venv" ]; then
    source venv/bin/activate
fi

export PYTHONPATH="$SCRIPT_DIR"

echo "=========================================="
echo "  Running Robot Framework Tests"
echo "=========================================="
echo ""
echo "Screenshots will be saved to:"
echo "  test-output/<timestamp>/<browser>/<test>/"
echo ""

# Run tests
robot --outputdir results tests/web/

echo ""
echo "=========================================="
echo "  Tests Complete!"
echo "=========================================="
echo ""
echo "Check test-output/ for organized screenshots"
echo ""
