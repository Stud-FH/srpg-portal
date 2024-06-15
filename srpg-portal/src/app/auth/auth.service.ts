import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { lastValueFrom, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static Url = 'api/v1/auth';

  constructor(
    private readonly oauthService: OAuthService,
    private readonly http: HttpClient
  ) {}

  public async pkce() {
    // var x = await this.oauthService.createAndSaveNonce();
    this.oauthService.initCodeFlow();
    await lastValueFrom(timer(100));
    const nonce = sessionStorage.getItem('nonce');
    const codeVerifier = sessionStorage.getItem('PKCE_verifier');
    await lastValueFrom(
      this.http.post(`${AuthService.Url}/nonce`, { nonce, codeVerifier })
    );
  }
}
