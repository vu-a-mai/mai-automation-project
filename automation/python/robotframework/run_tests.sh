#!/bin/bash
# Run Robot Framework tests with proper PYTHONPATH

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Set PYTHONPATH to parent of keywords folder
export PYTHONPATH="$SCRIPT_DIR"

# Run tests
robot --outputdir results tests/login.robot
