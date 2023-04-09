import { Injectable } from "@angular/core";
import { ChatMessage, ChatRelayMessage, User, WsMessage } from "@websocket/types";
import { BehaviorSubject, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket"

@Injectable()

export class AppService {
    private socket: WebSocketSubject<WsMessage>;
    public user$ = new BehaviorSubject<User>(undefined);
    public chatMessage$ = new Subject<ChatRelayMessage>()

    public connect(name: string) {
        this.socket = webSocket(`ws://localhost:8080?name=${name}`);
        this.socket.subscribe(message => this.onMessageFromServer(message));
    }

    public send(contents: string) {
        const chatMsg: ChatMessage = {
            event: 'chat',
            contents
        }
        this.socket.next(chatMsg)
    }

    private onMessageFromServer(message: WsMessage) {
        console.log('From server: ', message);

        switch(message.event) {
            case 'login': {
                this.user$.next(message.user);
                break;
            }
            case 'chatRelay': {
                this.chatMessage$.next(message);
                break;
            }
        }
    }

}
