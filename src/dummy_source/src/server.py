import os

PUBLISH_PORT = os.getenv('PUBLISH_PORT', '8000')
LISTEN_PORT = os.getenv('LISTEN_PORT', '80')

print(f"PUBLISH_PORT: {PUBLISH_PORT}")
print(f"LISTEN_PORT: {LISTEN_PORT}")

exit()