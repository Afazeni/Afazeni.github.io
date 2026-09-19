import tempfile
import threading
import unittest
from functools import partial
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer
from pathlib import Path
from serve_preview import RangeHandler


class RangeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        Path(cls.tmp.name, 'test.mp4').write_bytes(b'0123456789')
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(RangeHandler, directory=cls.tmp.name))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.tmp.cleanup()

    def request(self, range=None, method='GET'):
        conn = HTTPConnection('127.0.0.1', self.server.server_port)
        conn.request(method, '/test.mp4', headers={'Range': range} if range else {})
        response = conn.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        conn.close()
        return result

    def test_full(self):
        status, headers, data = self.request()
        self.assertEqual((status, data), (200, b'0123456789'))
        self.assertEqual(headers['Accept-Ranges'], 'bytes')

    def test_ranges(self):
        for value, expected, interval in [('bytes=2-5', b'2345', '2-5'),
                                          ('bytes=7-', b'789', '7-9'),
                                          ('bytes=-3', b'789', '7-9')]:
            status, headers, data = self.request(value)
            self.assertEqual((status, data), (206, expected))
            self.assertEqual(headers['Content-Range'], f'bytes {interval}/10')
            self.assertEqual(int(headers['Content-Length']), len(data))

    def test_unsatisfied(self):
        for value in ['bytes=10-', 'bytes=8-3', 'bytes=-0']:
            status, headers, _ = self.request(value)
            self.assertEqual(status, 416)
            self.assertEqual(headers['Content-Range'], 'bytes */10')

    def test_head_and_multiple(self):
        status, headers, data = self.request('bytes=2-5', 'HEAD')
        self.assertEqual((status, data), (206, b''))
        self.assertEqual(headers['Content-Length'], '4')
        self.assertEqual(self.request('bytes=0-1,4-5')[0], 200)


if __name__ == '__main__':
    unittest.main()
