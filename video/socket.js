module.exports = function (socketServer) {
    socketServer.connectionCount = 0;
    socketServer.on('connection', function(socket, upgradeReq) {
        socketServer.connectionCount++;
        console.log(
            'New WebSocket Connection: ', 
            (upgradeReq || socket.upgradeReq).socket.remoteAddress,
            (upgradeReq || socket.upgradeReq).headers['user-agent'],
            '('+socketServer.connectionCount+' total)'
        );
        socket.on('close', function(code, message){
            socketServer.connectionCount--;
            console.log(
                'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
            );
        });
    });
    socketServer.broadcast = function(data) {
        socketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };
    
}