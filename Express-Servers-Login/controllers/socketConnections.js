const io = require( "socket.io" )();
const socketapi = {
    io: io
};

io.on('connection', function(socket){

    socket.on('photoUploadEvent', function(data) {
    //  console.log('connection:', data.photoDisplayName);
      io.emit('photoUploadEvent', {
          artistDisplayName:data.artistDisplayName,
          photoDisplayName:data.photoDisplayName,
          photoImage: data.photoImage,
          photoDescription: data.photoDescription
      });
    });

});

module.exports = socketapi;
