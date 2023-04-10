import { WebSocket } from 'ws';
import { WsMessage, User, SystemNotice, ChatMessage, ChatRelayMessage } from '@websocket/types';
import { IncomingMessage } from 'http';

let currId = 1

export class UserManager {
    private _sockets = new Map<WebSocket, User>();

    public add(socket: WebSocket, request: IncomingMessage) {
        const fullURL = new URL(request.headers.host + request.url);
        const name = fullURL.searchParams.get('name');
        const user: User = {
            name,
            id: currId++
        };
        this._sockets.set(socket, user);
        const loggedInUsers = Array.from(this._sockets.values());
        const systemNotice: SystemNotice = {
            event: 'systemNotice',
            loggedInUsers,
            contents: `${name} has joined the chat`
        };
        this._sendToAll(systemNotice);

        const loginMessage = {
            user,
            event: 'login'
        }
        socket.send(JSON.stringify(loginMessage));

    }

    public remove(socket: WebSocket) {
        const user = this._sockets.get(socket);
        this._sockets.delete(socket);
        const loggedInUsers = Array.from(this._sockets.values());
        const systemNotice: SystemNotice = {
            event: 'systemNotice',
            loggedInUsers,
            contents: `${user.name} has left the chat`
        }
        this._sendToAll(systemNotice);
    }

    private _sendToAll(message: WsMessage) {
        const data = JSON.stringify(message);

        Array.from(this._sockets.keys()).forEach((socket) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data)
            }
        })
    }

    public relayChat(from: WebSocket, chatMsg: ChatMessage) {
        const relayMsg: ChatRelayMessage = {
            event: 'chatRelay',
            contents: chatMsg.contents,
            author: this._sockets.get(from)
        }

        this._sendToAll(relayMsg);
    }
}
