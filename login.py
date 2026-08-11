"""Simple username/password login with salted PBKDF2 password hashing."""

import getpass
import hashlib
import hmac
import json
import os
import secrets
from pathlib import Path

USERS_FILE = Path(__file__).with_name("users.json")
HASH_NAME = "sha256"
ITERATIONS = 200_000
MAX_ATTEMPTS = 3


def load_users():
    if not USERS_FILE.exists():
        return {}
    with USERS_FILE.open(encoding="utf-8") as handle:
        return json.load(handle)


def save_users(users):
    with USERS_FILE.open("w", encoding="utf-8") as handle:
        json.dump(users, handle, indent=2)


def hash_password(password, salt=None):
    salt = salt or os.urandom(16).hex()
    digest = hashlib.pbkdf2_hmac(
        HASH_NAME, password.encode("utf-8"), bytes.fromhex(salt), ITERATIONS
    )
    return salt, digest.hex()


def verify_password(password, salt, expected_hash):
    _, actual_hash = hash_password(password, salt)
    return hmac.compare_digest(actual_hash, expected_hash)


def register(username, password):
    users = load_users()
    if username in users:
        return False, "Username already exists."
    if len(password) < 8:
        return False, "Password must be at least 8 characters."
    salt, password_hash = hash_password(password)
    users[username] = {"salt": salt, "hash": password_hash}
    save_users(users)
    return True, "Account created."


def login(username, password):
    users = load_users()
    user = users.get(username)
    if user is None:
        # Hash anyway so timing does not reveal whether the user exists.
        hash_password(password, secrets.token_hex(16))
        return False
    return verify_password(password, user["salt"], user["hash"])


def main():
    print("Welcome to login")
    choice = input("Type 'register' or 'login': ").strip().lower()

    if choice == "register":
        username = input("Username: ").strip()
        password = getpass.getpass("Password: ")
        ok, message = register(username, password)
        print(message)
        if not ok:
            return

    for attempt in range(1, MAX_ATTEMPTS + 1):
        username = input("Username: ").strip()
        password = getpass.getpass("Password: ")
        if login(username, password):
            print(f"Login successful. Hello, {username}!")
            return
        print(f"Invalid credentials ({attempt}/{MAX_ATTEMPTS}).")

    print("Too many failed attempts. Access denied.")


if __name__ == "__main__":
    main()

