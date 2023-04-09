import { Component, OnInit } from '@angular/core';
import { ChatRelayMessage, User } from '@websocket/types'
import { AppService } from './app.service';

@Component({
  selector: 'websocket-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'I am Angular';
  public messages: ChatRelayMessage[] = [];
  public currentUser: User;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.chatMessage$.subscribe(msg => this.messages = [...this.messages, msg])

    this.appService.user$.subscribe(user => this.currentUser = user);
  }

  public connect(userNameInput: HTMLInputElement) {
    const name = userNameInput.value
    console.log(`Connecting as ${userNameInput.value}`);
    this.appService.connect(name);
  }

  public send(chatInput) {
    this.appService.send(chatInput.value);
    chatInput.value = '';
  }
}
