import type { Categories } from '@/models/msg/types';
import * as R from 'ramda';

class MsgCancelReplaceLimitOrder {
  public category: Categories;

  public type: string;

  public json: object;

  public owner: string;

  public originalClientOrderId: string;

  public newClientOrderId: string;

  public timeInForce: 'Unspecified' | 'GoodTillCancel' | 'ImmediateOrCancel' | 'FillOrKill';

  public source: MsgCoin;

  public destination: MsgCoin;

  constructor(payload: object) {
    this.category = 'market';
    this.type = R.pathOr('', ['type'], payload);
    this.json = R.pathOr({}, ['json'], payload);
    this.owner = R.pathOr('', ['owner'], payload);
    this.originalClientOrderId = R.pathOr('', ['originalClientOrderId'], payload);
    this.newClientOrderId = R.pathOr('', ['newClientOrderId'], payload);
    this.timeInForce = R.pathOr('Unspecified', ['timeInForce'], payload);
    this.source = R.pathOr({ denom: '', amount: '0' }, ['source'], payload);
    this.destination = R.pathOr({ denom: '', amount: '0' }, ['destination'], payload);
  }

  static fromJson(json: object): MsgCancelReplaceLimitOrder {
    return {
      category: 'market',
      json,
      type: R.pathOr('', ['@type'], json),
      owner: R.pathOr('', ['owner'], json),
      originalClientOrderId: R.pathOr('', ['original_client_order_id'], json),
      newClientOrderId: R.pathOr('', ['new_client_order_id'], json),
      timeInForce: R.pathOr('Unspecified', ['time_in_force'], json),
      source: {
        denom: R.pathOr('', ['source', 'denom'], json),
        amount: R.pathOr('', ['source', 'amount'], json),
      },
      destination: {
        denom: R.pathOr('', ['destination', 'denom'], json),
        amount: R.pathOr('', ['destination', 'amount'], json),
      },
    };
  }
}

export default MsgCancelReplaceLimitOrder;
