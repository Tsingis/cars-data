import http.server
import socketserver

PORT = 8000

socketserver.ThreadingTCPServer.allow_reuse_address = True


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if not self.path.startswith("/data/"):
            self.path = "/data" + self.path
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


if __name__ == "__main__":
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
        httpd.timeout = 60
        print(f"Serving at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()
