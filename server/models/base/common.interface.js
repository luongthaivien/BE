/* eslint no-unused-vars: 0 */
/* eslint no-empty-function: 0 */

export default class CommonInterface {
  constructor() {
    this._getCache = this._getCache.bind(this);
    this._getCacheKey = this._getCacheKey.bind(this);
    this._setCache = this._setCache.bind(this);
  }

  _getCache(id) {
    const keyCache = this._getCacheKey(id);
    return this.Redis.getAsync(keyCache);
  }

  _getCacheKey(id) {
    const className = this.constructor.name;
    return `${this.cachePrefix}:${className}:${id}`;
  }

  _setCache(detail) {
    const id = detail.id;
    const keyCache = this._getCacheKey(id);
    return this.Redis.set(keyCache, JSON.stringify(detail));
  }

  _setCacheBase(data, key) {
    const keyCache = this._getCacheKey(key);
    return this.Redis.set(keyCache, JSON.stringify(data));
  }

  create() {
  }

  findOneAndUpdate() {
  }

  update() {
  }

  remove() {
  }

  findAll() {
  }

  getFullList() {
  }

  findOne() {
  }

  findById() {
  }

  count() {
  }
}
