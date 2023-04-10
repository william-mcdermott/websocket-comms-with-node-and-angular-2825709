import { Component, OnInit } from '@angular/core';
import { ChatRelayMessage, User } from '@websocket/types'
import { AppService } from './app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'websocket-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public messages: ChatRelayMessage[] = [];
  public currentUser: User;
  public users: User[] = [];

  constructor(private _appService: AppService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this._appService.chatMessage$.subscribe(msg => this.messages = [...this.messages, msg])
    this._appService.systemMessage$.subscribe((msg) => {
        if (this.currentUser) {
          this._openSnackBar(msg.contents, 'Dismiss')
        }
    })
    this._appService.user$.subscribe(user => this.currentUser = user);
    this._appService.users$.subscribe(users => this.users = users);

  }

  private _connect(userNameInput: HTMLInputElement) {
    const name = userNameInput.value
    console.log(`Connecting as ${userNameInput.value}`);
    this._appService.connect(name);
  }

  public send(chatInput) {
    this._appService.send(chatInput.value);
    chatInput.value = '';
  }

  private _openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 })
  }
}
