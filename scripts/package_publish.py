#! /usr/bin/env python

import os
import subprocess as sp
from pathlib import Path
import json
from shutil import copytree, rmtree
import argparse

MANIFEST = Path("./public/manifest.json")
BLOG_ROOT = Path("..") / "sapristi.github.io"
BLOG_FOLDER = "journal-startpage"

def load_env():
    res = {}
    with open(".env") as f:
        for line in f.readlines():
            if line.startswith("#"):
                continue
            if len(line) == 0:
                continue
            key, value = [
                entry.strip()
                for entry in line.split("=", 1)
            ]
            res[key] = value
    return res

def update_json_file(version, filepath):
    """Used both for package.json and manifest.json"""
    with open(filepath) as f:
        data = json.load(f)
    current_version = data["version"]
    if version == current_version:
        print(f"{version} is already the current version")
        exit(1)

    data["version"] = version
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

def git(command: list[str], **kwargs):
    return sp.run(["git", *command], **kwargs, check=True)

def pnpm(command: list[str], **kwargs):
    sp.run(["pnpm", *command], **kwargs, check=True)


def update_blog(version):

    pnpm(["build"], env={
        **os.environ,
        "REACT_APP_USE_LOCALSTORAGE": "true",
        "REACT_APP_MOCK_BOOKMARKS": "true",
    })
    rmtree("../sapristi.github.io/journal-startpage")
    copytree("./build", "../sapristi.github.io/journal-startpage")
    git(["add", BLOG_FOLDER], cwd=BLOG_ROOT)
    git(["commit", "-m", f"update journal-startpage to v{version}"], cwd=BLOG_ROOT)
    git(["push"], cwd=BLOG_ROOT)

def publish_AMO(channel):
    # Old command is
    # pnpm web-ext sign -s build --channel=listed
    sp.run(
        [
            "pnpm", "web-ext", "sign", "-s=build", f"--channel={channel}",
            "--use-submission-api", "--amo-base-url=https://addons.mozilla.org/api/v5/"
        ],
        env={
            **os.environ,
            **load_env()
        },
        check=True
    )

def print_header(*args):
    print("#"*20)
    print(*args)
    print("#"*20)
    print()


def checks():
    """
    Checks that the git state is clean, and we didn't put
    the manifest in dev mode.
    """
    status_process = git(["status", "--porcelain"], capture_output=True)
    if status_process.stdout:
        print("ERROR Git status is not clean")
        exit(1)

    manifest = json.loads(MANIFEST.read_text())
    if "content_security_policy" in  manifest:
        print("ERROR Code was modified for a dev build")
        exit(1)

    print("All checks ok")
    print()

def main(
    version: str,
    channel: str
):
    checks()
    print_header(f"Updating files with new version {version}")
    update_json_file(version, MANIFEST)
    update_json_file(version, "package.json")
    tag_name = f"v{version}"

    print_header("Building extension")
    pnpm(["install"])
    pnpm(["build"])

    print_header("Commit, tag, push")
    git(["add", "-u"])
    git(["commit", "-m", f"bump to version {version}"])
    git(["tag", tag_name])
    git(["push"])
    git(["push", "origin", tag_name])


    # Very long when using the API, so put it at the end
    print_header(f"Publish as {channel}")
    publish_AMO(channel)

    print_header("Updating blog")
    update_blog(version)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("version")
    parser.add_argument("--channel", default="listed", choices=["listed", "unlisted"])
    parser.add_argument("--blog-only", action=argparse.BooleanOptionalAction)

    args = parser.parse_args()
    if args.blog_only:
        pnpm(["install"])
        pnpm(["build"])
        update_blog(args.version)
        exit(0)

    main(
        args.version,
        args.channel
    )
