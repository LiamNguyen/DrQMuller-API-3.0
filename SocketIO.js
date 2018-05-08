const socketIO = require('socket.io');
const {
  appointmentCreated,
  refreshAppointments,
  appointmentConfirmed,
  refreshUserAppointments
} = require('./constants/SocketIOListenerConstants');

module.exports = {
  init(server) {
    const io = socketIO(server);

    io.on('connection', socket => {
      socket.on(appointmentCreated, appointmentId => {
        io.sockets.emit(refreshAppointments, appointmentId);
      });
      socket.on(appointmentConfirmed, appointmentId => {
        io.sockets.emit(refreshUserAppointments, appointmentId);
      });
    });
  }
};
