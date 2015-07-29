import ActionTypes from '../constants/ActionTypes';
import Immutable from 'immutable';
import debug from 'debug';

const log = debug('fou:AppActions');

export async function userSignedIn(actionContext, account) {
  log('userSignedIn', account);
  actionContext.dispatch(ActionTypes.USER_SIGNED_IN, new Immutable.Map(account));
}

export async function userSignedOut(actionContext) {
  log('userSignedOut');
  actionContext.dispatch(ActionTypes.USER_SIGNED_OUT);
}

export async function serverInit(actionContext, state) {
  log('serverInit', state);

  if (state.account) {
    await actionContext.executeAction(userSignedIn, state.account);
  }
}
