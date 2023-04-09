import { Component, OnInit } from '@angular/core';
import { ChatRelayMessage, User } from '@websocket/types'

@Component({
  selector: 'websocket-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'I am Angular';
  public messages: ChatRelayMessage[];
  public currentUser: User;

  ngOnInit() {
    this.messages = [
      {event: 'chatRelay', author: {name: 'Jane', id: 1}, contents: 'Hi this is Jane'},
      {event: 'chatRelay', author: {name: 'Henry', id: 2}, contents: 'Hello Jane I\'m Henry'},
    ]

    this.currentUser = { name: 'Xavier', id: 3 };
  }
}
