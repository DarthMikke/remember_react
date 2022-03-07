#!/usr/bin/env python3
# -*-coding: utf-8 -*-
import os
import re
import json

# Check that the changelog exists
CHANGELOG = "./docs/CHANGELOG.md"
if not os.path.isfile(CHANGELOG):
    print("No changelog found.")
    exit(1)

# Find newest version number in the Changelog
pattern = re.compile("\[v (.*)\]")
with open(CHANGELOG) as fh:
    version = pattern.search(fh.read())
if version is None:
    print("No version number found in the changelog")
    exit(2)

version = version.group(1)

# Check if package.json contains version number
with open('./package.json') as fh:
    package = json.loads(fh.read())

if 'version' not in package.keys():
    print("No version number found in the package.json file.")
    exit(5)

package_version = package['version']
if version != package_version:
    print(f"""Version numbers in package.json and in the changelog must have the same value.
    [v {version}] is specified in the CHANGELOG.
    [v {package_version}] is specified in the package.json.""")
    exit(6)

# Check if manifest in the public folder contains version number
with open('./public/manifest.json') as fh:
    manifest = json.loads(fh.read())

if 'version' not in manifest.keys():
    print("No version number found in the manifest.")
    exit(3)

manifest_version = manifest['version']

if version != manifest_version:
    print(f"""Version numbers in the manifest and in the changelog must have the same value.
    [{version}] is specified in the CHANGELOG.
    [{manifest_version}] is specified in the manifest.""")
    exit(4)

exit(0)
