import { Injectable } from "@angular/core";
import { User, WsMessage } from "@websocket/types";
import { BehaviorSubject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket"

@Injectable()

export class AppService {
    public user$ = new BehaviorSubject<User>(undefined);
    private socket: WebSocketSubject<WsMessage>;

    public connect(name: string) {
        this.socket = webSocket(`ws://localhost:8080?name=${name}`);
        this.socket.subscribe(message => this.onMessageFromServer(message));
    }

    private onMessageFromServer(message: WsMessage) {
        console.log('From server: ', message);

        switch(message.event) {
            case 'login': {
                this.user$.next(message.user);
                break;
            }
        }
    }

}
