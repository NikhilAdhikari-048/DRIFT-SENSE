"""
Standalone Python API Endpoint Server for Wafer Navigation Recovery
Provides HTTP POST /api/recovery endpoint using pure Python http.server module.
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from recovery_loop import run_recovery_loop

class WaferRecoveryAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == "/health" or self.path == "/api/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "healthy", "service": "Python Wafer Recovery API"}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        if self.path == "/api/recovery" or self.path == "/run-recovery":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                inputs = json.loads(post_data.decode('utf-8'))
                result = run_recovery_loop(inputs)
                self._set_headers(200)
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, WaferRecoveryAPIHandler)
    print(f"Starting Python API Server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")

if __name__ == "__main__":
    run_server()
