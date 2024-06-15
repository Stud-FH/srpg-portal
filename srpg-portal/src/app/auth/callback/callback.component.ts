import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private oauthService: OAuthService) {}

  ngOnInit(): void {
    this.oauthService.tryLoginCodeFlow();
  }
}
