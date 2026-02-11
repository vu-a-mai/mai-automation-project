# tests-python/playwright/conftest.py
"""
Pytest configuration for Playwright tests
"""

import pytest


@pytest.fixture(scope="session")
def browser_context_args():
    """Configure browser context"""
    return {
        "viewport": {"width": 1280, "height": 720},
        "record_video_dir": "test-results/videos/",
    }
