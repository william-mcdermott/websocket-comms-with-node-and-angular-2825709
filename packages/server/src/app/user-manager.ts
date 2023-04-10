import { WebSocket } from 'ws';
import { WsMessage, User, SystemNotice, ChatMessage, ChatRelayMessage } from '@websocket/types';
import { IncomingMessage } from 'http';

let currId = 1

export class UserManager {
    private sockets = new Map<WebSocket, User>();

    add(socket: WebSocket, request: IncomingMessage) {
        const fullURL = new URL(request.headers.host + request.url);
        const name = fullURL.searchParams.get('name');
        const user: User = {
            name,
            id: currId++
        };
        const systemNotice: SystemNotice = {
            event: 'systemNotice',
            contents: `${name} has joined the chat`
        };
        this.sendToAll(systemNotice);

        const loginMessage = {
            user,
            event: 'login'
        }
        socket.send(JSON.stringify(loginMessage));

        this.sockets.set(socket, user);
    }

    remove(socket: WebSocket) {
        const user = this.sockets.get(socket);
        const systemNotice: SystemNotice = {
            event: 'systemNotice',
            contents: `${user.name} has left the chat`
        }
        this.sendToAll(systemNotice);
        this.sockets.delete(socket);
    }

    send(socket: WebSocket, message: WsMessage) {
        const data = JSON.stringify(message);
        socket.send(data);
    }

    sendToAll(message: WsMessage) {
        const data = JSON.stringify(message);

        Array.from(this.sockets.keys()).forEach((socket) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data)
            }
        })
    }

    relayChat(from: WebSocket, chatMsg: ChatMessage) {
        const relayMsg: ChatRelayMessage = {
            event: 'chatRelay',
            contents: chatMsg.contents,
            author: this.sockets.get(from)
        }

        this.sendToAll(relayMsg);
    }
}
