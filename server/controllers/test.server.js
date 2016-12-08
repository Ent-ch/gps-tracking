import net from 'net';

net.createServer(function (socket) {
  // var remClient = socket.remoteAddress + ":" + socket.remotePort;
  // console.log(remClient);
  let d = new Date();
  console.log("New test device connected at ", d.toDateString());

  socket.on('data', function (data) {
    console.log(data.toString());
  });
  socket.on('end', function () {
    console.log('client disconected');
  });
}).listen(8095);

console.log("Test server running at port 8095\n");
