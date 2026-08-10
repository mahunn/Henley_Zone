// In-Memory Fallback Cache Store for Shared Hosting (cPanel)
if (!global.memoryCacheStore) {
  global.memoryCacheStore = new Map();
}

function getMemoryCache(key) {
  try {
    const item = global.memoryCacheStore.get(key);
    if (!item) return null;
    if (item.expireAt && item.expireAt < Date.now()) {
      global.memoryCacheStore.delete(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

function setMemoryCache(key, value, ttlSeconds = 604800) {
  try {
    if (global.memoryCacheStore.size > 500) {
      const firstKey = global.memoryCacheStore.keys().next().value;
      if (firstKey) global.memoryCacheStore.delete(firstKey);
    }
    global.memoryCacheStore.set(key, {
      value,
      expireAt: Date.now() + ttlSeconds * 1000
    });
  } catch {
    /* silent fallback */
  }
}

class CacheHandler {
  constructor(options) {
    this.options = options;
    this.client = null;

    const redisUrl = process.env.REDIS_URL;
    if (redisUrl && typeof redisUrl === "string" && redisUrl.trim().length > 0) {
      try {
        const { createClient } = require("redis");
        if (!global.redisClient) {
          global.redisClient = createClient({ url: redisUrl.trim() });
          global.redisClient.on("error", () => {
            global.redisClientActive = false;
          });
          global.redisClient.connect().catch(() => {
            global.redisClientActive = false;
          });
        }
        this.client = global.redisClient;
      } catch {
        this.client = null;
      }
    }
  }

  async get(key) {
    try {
      if (this.client && this.client.isOpen && this.client.isReady) {
        const val = await this.client.get(key);
        if (val) {
          const entry = JSON.parse(val);
          return entry ? entry.value : null;
        }
      }
    } catch {
      /* fallback to in-memory */
    }
    return getMemoryCache(key);
  }

  async set(key, data, ctx) {
    try {
      const ttl = typeof ctx?.revalidate === "number" && ctx.revalidate > 0 ? ctx.revalidate : 604800;
      setMemoryCache(key, data, ttl);

      if (this.client && this.client.isOpen && this.client.isReady) {
        const entry = {
          lastModified: Date.now(),
          value: data,
          tags: ctx?.tags || data?.tags || []
        };
        await this.client.set(key, JSON.stringify(entry), { EX: ttl });
      }
    } catch {
      /* silent */
    }
  }

  async revalidateTag(tag) {
    try {
      if (this.client && this.client.isOpen && this.client.isReady) {
        await this.client.set(`tag:${tag}`, Date.now().toString());
      }
    } catch {
      /* silent */
    }
  }
}

module.exports = CacheHandler;
