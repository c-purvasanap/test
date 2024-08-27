import { betaSDK, client } from '@devrev/typescript-sdk';
import {
  AuthTokenGrantType,
  AuthTokenRequestedTokenType,
  AuthTokenSubjectTokenType,
} from '@devrev/typescript-sdk/dist/auto-generated/beta/beta-devrev-sdk';

import { getRevUserToken } from './devrev_api';

export function getDevRevBetaSDK(event: any) {
  const devrevAuthToken = event.context.secrets.service_account_token;
  const API_BASE = event.execution_metadata.devrev_endpoint;
  const devrevBetaSDK = getDevRevBetaClient(devrevAuthToken, API_BASE);
  return devrevBetaSDK;
}

export function getDevRevBetaClient(devrevAuthToken: string, API_BASE = 'https://api.devrev.ai') {
  const devrevBetaSDK = client.setupBeta({
    endpoint: API_BASE,

    token: devrevAuthToken,
  });
  return devrevBetaSDK;
}

export async function getRevUserByUserID(userID: string, devrevSDK: betaSDK.Api<unknown>) {
  const body = {
    grant_type: AuthTokenGrantType.UrnIetfParamsOauthGrantTypeTokenExchange,
    requested_token_type: AuthTokenRequestedTokenType.UrnDevrevParamsOauthTokenTypeSession,
    subject_token: JSON.stringify({
      revu_don: userID,
    }),
    subject_token_type: AuthTokenSubjectTokenType.UrnDevrevParamsOauthTokenTypeUserinfo,
  };
  const revUserToken = await getRevUserToken(devrevSDK, body);
  return revUserToken;
}
