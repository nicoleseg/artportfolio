const io = require( "socket.io" )();
const socketapi = {
    io: io
};

io.on('newPhotos', function(socket){
    socket.on('newPhotos', function(data) {
      console.log('newPhotos:', data);

    });
});

module.exports = socketapi;
