#! /usr/bin/env python
"""
Script used to enable react devtools on the dev build of the extension
"""
import json
import os
from pathlib import Path
import subprocess as sp


def add_permission_to_manifest(content:str):
    data = json.loads(content)
    data["content_security_policy"] = "connect-src ws://localhost:8097"
    return json.dumps(data)

def add_devtools_import(content: str):
    return "\n".join(
        (
            "import 'react-devtools'",
            *content.splitlines(keepends=False)
        )
    )

def main():
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
        sp.run(["pnpm", "react-app-rewired", "build"], env={
            "INLINE_RUNTIME_CHUNK": "false",
            "DEV_MODE": "true",
            "REACT_APP_LOG": "true",
            **os.environ,
        })
    except KeyboardInterrupt:
        pass
    finally:
        for patch in patches:
            patch["filepath"].write_text(patch["initial_content"])

if __name__ == "__main__":
    main()
