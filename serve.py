import http.server
import os

class RewriteHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/clarity2' or self.path == '/lead' or self.path == '/alan':
            self.path = '/clarity2.html'
        return super().do_GET()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    server = http.server.HTTPServer(('127.0.0.1', port), RewriteHandler)
    print(f'Servidor em http://127.0.0.1:{port}')
    server.serve_forever()
