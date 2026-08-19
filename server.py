import http.server
import socketserver
import os

PORT = int(os.environ.get('PORT', 3000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    try:
        httpd = ReusableTCPServer(("", PORT), Handler)
    except OSError:
        PORT = 8080
        httpd = ReusableTCPServer(("", PORT), Handler)

    print(f"[INFO] Static Portfolio Server running at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Server stopped.")
