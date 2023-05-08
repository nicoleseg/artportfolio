const io = require( "socket.io" )();
const socketapi = {
    io: io
};

io.on('viwerCountUpdate', function(socket){
    socket.on('viwerCountUpdate', function(data) {
      console.log('viwerCountUpdate:', data);
      io.emit('viwerCountUpdate', {
        numClients: io.engine.clientsCount,
      });
    });
});

module.exports = socketapi;
