import base64
import os
from cryptography.fernet import Fernet
from flask import current_app

def get_cipher():
    key = current_app.config['ENCRYPTION_KEY']
    return Fernet(base64.urlsafe_b64encode(key.encode().ljust(32)[:32]))

def encrypt_token(token: str) -> str:
    return get_cipher().encrypt(token.encode()).decode()

def decrypt_token(encrypted: str) -> str:
    return get_cipher().decrypt(encrypted.encode()).decode()
