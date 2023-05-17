const io = require( "socket.io" )();
const socketapi = {
    io: io
};

io.on('connection', function(socket){
console.log('socket server started')
    socket.on('photoUploadEvent', function(data) {
      console.log('photoUploadEvent:', data.photoDisplayName);
      io.emit('photoUploadEvent', {
          artistDisplayName:data.artistDisplayName,
          photoDisplayName:data.photoDisplayName,
          photoImage: data.photoImage,
          photoDescription: data.photoDescription
      });
    });

});

module.exports = socketapi;
