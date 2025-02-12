import type { Categories } from '@/models/msg/types';
import * as R from 'ramda';

class MsgGrant {
  public category: Categories;

  public type: string;

  public json: object;

  public granter: string;

  public grantee: string;

  constructor(payload: object) {
    this.category = 'authz';
    this.type = R.pathOr('', ['type'], payload);
    this.json = R.pathOr({}, ['json'], payload);
    this.granter = R.pathOr('', ['granter'], payload);
    this.grantee = R.pathOr('', ['grantee'], payload);
  }

  static fromJson(json: object): MsgGrant {
    return {
      category: 'authz',
      json,
      type: R.pathOr('', ['@type'], json),
      granter: R.pathOr('', ['granter'], json),
      grantee: R.pathOr('', ['grantee'], json),
    };
  }
}

export default MsgGrant;
