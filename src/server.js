const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

const io = socketio(app);

io.on('connection', (socket) => {
  const sock = socket;

  sock.join('room1');

  sock.on('setShape', (data) => {
    const square = {
      x: data.x,
      y: data.y,
      height: 100,
      width: 100,
	  time: data.time,
		coords: data.coords,
    };
    io.sockets.in('room1').emit('update', square);
  });

  sock.on('disconnect', () => {
    io.sockets.in('room1').emit('left', sock.shape);

    sock.leave('room1');
  });
});

console.log(`Listening on port: ${port}`);
