import { WebSocket, WebSocketServer, ServerOptions, RawData } from 'ws';
import { UserManager } from './user-manager';
import { WsMessage } from '@websocket/types';

export class WsHandler {
    private _wsServer: WebSocketServer;
    private _userManager: UserManager

    public _initialize(options: ServerOptions) {
        this._wsServer = new WebSocketServer(options);
        this._userManager = new UserManager();

        this._wsServer.on('listening', () => console.log(`Server listening on port ${options.port}`));
        this._wsServer.on('connection', (socket, request) => this._onSocketConnected(socket, request));
    }

    private _onSocketConnected(socket, request) {
        console.log('New websocket connection!');
        this._userManager.add(socket, request);

        socket.on('message', (data) => this._onSocketMessage(socket, data));
        socket.on('close', ((code, reason) => this._onSocketClosed(socket, code, reason)));
    }

    private _onSocketMessage(socket: WebSocket, data: RawData) {
        const payload: WsMessage = JSON.parse(`${data}`);
        console.log('Received: ', payload);
        switch (payload.event) {
            case 'chat': {
                this._userManager.relayChat(socket, payload);
                break;
            }
        };
    }

    private _onSocketClosed(socket: WebSocket, code: number, reason: Buffer) {
        console.log(`Client has disconnected; code=${code}, reason=${reason}`);
        this._userManager.remove(socket);
    }
}
