import os

def test_index_exists():
    assert os.path.exists("index.html"), "index.html file is missing"
