import { Injectable } from "@angular/core";
import { ChatMessage, ChatRelayMessage, SystemNotice, User, WsMessage } from "@websocket/types";
import { BehaviorSubject, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket"

@Injectable()

export class AppService {
    private socket: WebSocketSubject<WsMessage>;
    public user$ = new BehaviorSubject<User>(undefined);
    public chatMessage$ = new Subject<ChatRelayMessage>();
    public systemMessage$ = new Subject<SystemNotice>();
    public users$ = new Subject<User[]>();

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
            case 'systemNotice': {
                this.systemMessage$.next(message);
                this.users$.next(message.loggedInUsers)
                break;
            }
        }
    }

}
