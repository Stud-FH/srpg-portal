import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: '',
  loginUrl: 'https://discord.com/api/oauth2/authorize',
  redirectUri: window.location.origin + '/api/v1/auth/callback',
  clientId: '1249604214158790718',
  responseType: 'code',
  scope: 'identify',
  useSilentRefresh: false,
  showDebugInformation: true,
  customQueryParams: {
    prompt: 'none',
  },
};
