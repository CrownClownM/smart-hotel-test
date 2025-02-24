import { storage } from "./storage-handlers";

export class Permissions {
  private readonly _user: any | null = null;

  constructor() {
    this._user = storage.GET({ key: 'userData' });
  }

  get isAdmin() {
    return this._user?.role === 'admin';
  }

  get isTraveler() {
    return this._user?.role === 'traveler';
  }

}
