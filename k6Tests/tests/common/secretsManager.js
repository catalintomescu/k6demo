import encoding from 'k6/encoding';

export class SecretsManager {
  constructor(DATA) {
    this._init(DATA);
  }

  _init(DATA) {
    // this._data = { ...DATA };
    this._data = Object.assign({}, DATA);

    if (DATA.userPassword) {
      DATA.userPassword = "***";
      this._data.userPassword = encoding.b64encode(this._data.userPassword);
    }
      
    if (DATA.client_secret) {
      DATA.client_secret = "***";
      this._data.client_secret = encoding.b64encode(this._data.client_secret);
    }
  }

  getSecrets() {
    let tmp = Object.assign({}, this._data);

    if (tmp.userPassword)
      tmp.userPassword = encoding.b64decode(tmp.userPassword, 'std', 's');
    if (tmp.client_secret)
      tmp.client_secret = encoding.b64decode(tmp.client_secret, 'std', 's');

    return tmp;
  }
}
