function MemoryCache() {
  this.cache = {}
  this.size = 0
}

MemoryCache.prototype.add = function (key, value, time, timeoutCallback) {
  const old = this.cache[key]
  const instance = this

  const entry = {
    value,
    expire: time + Date.now(),
    timeout: setTimeout(function () {
      instance.delete(key)
      return timeoutCallback && typeof timeoutCallback === 'function' && timeoutCallback(value, key)
    }, time)
  }

  this.cache[key] = entry
  this.size = Object.keys(this.cache).length

  return entry
}

MemoryCache.prototype.delete = function (key) {
  const entry = this.cache[key]
  if (entry) clearTimeout(entry.timeout)

  delete this.cache[key]

  this.size = Object.keys(this.cache).length

  return null
}

MemoryCache.prototype.get = function (key) {
  return this.cache[key]
}

MemoryCache.prototype.getValue = function (key) {
  const entry = this.get(key)

  return entry && entry.value
}

MemoryCache.prototype.clear = function () {
  Object.keys(this.cache).forEach(function (key) {
    this.delete(key)
  }, this)

  return true
}

module.exports = MemoryCache
