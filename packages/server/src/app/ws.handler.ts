import { WebSocket, WebSocketServer, ServerOptions } from 'ws';

export class WsHandler {
    private wsServer: WebSocketServer;

    initialize(options: ServerOptions) {
        this.wsServer = new WebSocketServer(options);

        this.wsServer.on('listening', () => console.log(`Server listening on port ${options.port}`));
        this.wsServer.on('connection', (socket, request) => this.onSocketConnected(socket, request));
    }

    onSocketConnected(socket, request) {
        console.log('New websocket connection!');
        
    }
}