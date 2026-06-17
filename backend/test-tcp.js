const net = require('net');

const client = new net.Socket();
const HOST = '127.0.0.1';
const PORT = 8080;

client.connect(PORT, HOST, () => {
  console.log('Connected to server!');
  client.write('GET / HTTP/1.1\r\n\r\n');
});

client.on('data', (data) => {
  console.log('Received:', data.toString());
  client.destroy();
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Connection error:', err.message);
});