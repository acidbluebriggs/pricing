#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000
os.chdir('.')

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    print(f"Visit: http://localhost:{PORT}/pricing")
    httpd.serve_forever()
