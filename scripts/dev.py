#! /usr/bin/env python
"""
Script used to enable react devtools on the dev build of the extension
"""
import json
import os
from pathlib import Path
import subprocess as sp
import argparse
from contextlib import contextmanager


def add_permission_to_manifest(content:str):
    data = json.loads(content)
    data["content_security_policy"] = {"extension_pages": "script-src 'self'; connect-src ws://localhost:8097"}
    return json.dumps(data)

def add_devtools_import(content: str):
    return "\n".join(
        (
            "import 'react-devtools'",
            *content.splitlines(keepends=False)
        )
    )

@contextmanager
def dev_patches():
    patches = (
        {
            "filepath": Path("public/manifest.json"),
            "transform": add_permission_to_manifest
        },
        {
            "filepath": Path("src/index.js"),
            "transform": add_devtools_import
        }
    )
    for patch in patches:
        patch["initial_content"] = patch["filepath"].read_text()
        patch["filepath"].write_text(
            patch["transform"](patch["initial_content"])
        )

    try:
        yield
    finally:
        for patch in patches:
            patch["filepath"].write_text(patch["initial_content"])

def main(action):
    with dev_patches():
        if action == "build":
            sp.run(["pnpm", "react-app-rewired", "build"], env={
                "INLINE_RUNTIME_CHUNK": "false",
                "REACT_APP_DEV_MODE": "true",
                **os.environ,
            })
        elif action == "start":
            sp.run(["pnpm", "react-scripts", "start"], env={
                "INLINE_RUNTIME_CHUNK": "false",
                "REACT_APP_DEV_MODE": "true",
                "REACT_APP_USE_LOCALSTORAGE": "true",
                "REACT_APP_MOCK_BROWSER_APIS": "true",
                **os.environ,
            })


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["build", "start"])
    args = parser.parse_args()
    main(args.action)
