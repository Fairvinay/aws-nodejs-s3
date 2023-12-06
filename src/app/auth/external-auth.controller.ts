import { Request, Response, Router } from 'express';
import { ExternalAuthService } from './services/external-auth/external-auth.service';
import stateService from './services/external-auth/state.service';
import config from '../../config';
import log from '../../utils/logger';

const axios = require('axios');

const router = Router();
const JWT_TOKEN = "JWT_TOKEN";
const externalAuthService = new ExternalAuthService();

router.get('/:provider/:action', function (req: Request, res: Response) {
  const provider = req.params.provider;
  const action = req.params.action === 'signup' ? 'signup' : 'login';

  console.log("provider "+provider)
   console.log("action "+action)
 
  if (provider in config.externalAuth) {
    const providerConfig = (<any>config.externalAuth)[provider];
    const redirect_uri = `${providerConfig.callbackURL}`; // /${action}
    const body = "";
     const options = { headers: { accept: 'application/json' } };
 /*   axios.post(`${providerConfig.authorizeUrl}` +
      `?client_id=${providerConfig.clientID}` +
      `&response_type=code` +
      `&state=${stateService.setAndGetNewState(req.session)}` +
      // `&access_type=offline` + // INFO: this requests Refresh Token
      `&scope=${providerConfig.scope}` +
      `&redirect_uri=${redirect_uri}`, body, options)
      .then((res: any) => res.data['access_token']) // INFO: also `refresh_token` and `expires_in` in res.data
      .catch((error: any) => {
        log.error('auth.google.getAccessToken_failed', { error });
        throw error;
      })
  */

    res.redirect(`${providerConfig.authorizeUrl}` +
      `?client_id=${providerConfig.clientID}` +
      `&response_type=code` +
      `&state=${stateService.setAndGetNewState(req.session)}` +
      // `&access_type=offline` + // INFO: this requests Refresh Token
      `&scope=${providerConfig.scope}` +
      `&redirect_uri=${redirect_uri}`);

  } else {
    res.redirect(`/login?msg=Provider not supported`);
  }

});

router.get('/:provider/callback/signup', function (req, res) {
  const provider = req.params.provider;
  const authCode = req.query.code as string;
  const state = req.query.state as string;
  stateService.assertStateIsValid(req.session, state).then(() =>
    externalAuthService.signup(provider, authCode, req.session).then(() => {
      res.redirect('/');
    })
  ).catch((err) => {
    res.redirect(`/login?msg=${err ? err : 'Signup failed'}`);
  });
});

router.get('/:provider/callback/login', function (req, res) {
  const provider = req.params.provider;
  const authCode = req.query.code as string;
  const state = req.query.state as string;
  console.log("authCode "+authCode)
  stateService.assertStateIsValid(req.session, state).then(() =>
    externalAuthService.login(provider, authCode, req.session).then(() => {
      let token = localStorage.getItem(JWT_TOKEN) //localStorage.setItem(this.JWT_TOKEN
      console.log(" redirecting to :"+`https://localhost:8000/app?jwt_token=${token}`)
      res.redirect(`https://localhost:8000/app?jwt_token=${token}`);
    })
  ).catch((err) => {
    res.redirect(`https://localhost:8000/login?msg=${err ? err : 'Login failed'}`);
  });
});

router.get('/:provider/logout', function (req, res) {

   localStorage.clear(); //.setItem(JWT_TOKEN,null);
    res.redirect(`https://localhost:8000/login`); //?msg=${'message' : 'Logout failed'}
 
});


export default router;