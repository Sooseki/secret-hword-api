app.ws('/game', async (socket, req)=> {
    // res.sendFile(path.join(__dirname, 'template/game/test.html'));
    socket.on('connection', (socket) => {
      console.log(`[connection] ${socket}`)
    })
    socket.on('message', async(message) => {
      console.log(`${message}`)
    })
    console.log('test');
  });