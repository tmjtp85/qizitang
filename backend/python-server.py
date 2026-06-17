# -*- coding: utf-8 -*-
import http.server
import socketserver
import threading
import time

print("启字堂服务器 - Python HTTP 服务器测试")

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"收到请求: {self.path}")
        self.send_response(200)
        self.send_header("Content-type", "text/plain; charset=utf-8")
        self.end_headers()
        response_text = "启字堂 Python 服务器响应\n时间: " + time.strftime('%Y/%m/%d %H:%M:%S') + "\n"
        self.wfile.write(response_text.encode('utf-8'))

# 启动服务器
PORT = 3001
Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Python 服务器启动成功 - 端口 {PORT}")
    print(f"地址: http://127.0.0.1:{PORT}")
    
    # 立即自我测试
    import urllib.request
    try:
        response = urllib.request.urlopen(f"http://127.0.0.1:{PORT}", timeout=5)
        print(f"自我测试成功 - 状态码: {response.getcode()}")
        response.close()
    except Exception as e:
        print(f"自我测试失败: {e}")
    
    print("服务器正在运行，按 Ctrl+C 停止")
    httpd.serve_forever()