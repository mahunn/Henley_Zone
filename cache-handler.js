let createClient = null;
try {
  createClient = require("redis").createClient;
} catch {
  /* Redis not installed or unavailable */
}

// In-Memory fallback store for when Redis is unavailable on shared hosting
if (!global.memoryCacheStore) {
  global.memoryCacheStore = new Map();
}

function getMemoryCache(key) {
  const item = global.memoryCacheStore.get(key);
  if (!item) return null;
  if (item.expireAt && item.expireAt < Date.now()) {
    global.memoryCacheStore.delete(key);
    return null;
  }
  return item.value;
}

function setMemoryCache(key, value, ttlSeconds = 604800) {
  if (global.memoryCacheStore.size > 500) {
    const firstKey = global.memoryCacheStore.keys().next().value;
    if (firstKey) global.memoryCacheStore.delete(firstKey);
  }
  global.memoryCacheStore.set(key, {
    value,
    expireAt: Date.now() + ttlSeconds * 1000
  });
}

class CacheHandler {
  constructor(options) {
    this.options = options;

    if (!global.redisClient) {
      const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
      let clientOptions = {};

      if (redisUrl.startsWith("/") || redisUrl.startsWith("unix:")) {
        // Unix Socket Path
        let socketPath = redisUrl;
        if (redisUrl.startsWith("unix:")) {
          socketPath = redisUrl.replace(/^unix:(\/\/)?/, "");
        }
        clientOptions = {
          socket: {
            path: socketPath
          }
        };
      } else {
        clientOptions = { url: redisUrl };
      }

      try {
        if (typeof createClient !== "function") throw new Error("Redis module not installed.");
        global.redisClient = createClient(clientOptions);
        global.redisClientActive = true;
        
        let loggedRefused = false;

        global.redisClient.on("error", (err) => {
          if (err.code === "ECONNREFUSED") {
            global.redisClientActive = false;
            if (!loggedRefused && !process.env.REDIS_URL) {
              console.warn("Redis: local server not running on 127.0.0.1:6379 (using in-memory cache fallback).");
              loggedRefused = true;
            }
            return;
          }
          console.error("Redis Client Error:", err.message || err);
        });

        global.redisClient.connect().catch((err) => {
          if (err.code === "ECONNREFUSED") {
            global.redisClientActive = false;
            return;
          }
          console.error("Redis connection failed:", err.message || err);
        });
      } catch (err) {
        console.error("Redis client initialization failed, falling back to memory cache:", err.message || err);
        global.redisClient = {
          isOpen: false,
          isReady: false,
          on: () => {},
          connect: () => Promise.resolve(),
          get: () => Promise.resolve(null),
          set: () => Promise.resolve()
        };
      }
    }
    this.client = global.redisClient;
  }

  async get(key) {
    const isBuild = process.env.NEXT_PHASE === "phase-production-build";
    try {
      if (this.client && this.client.isOpen && this.client.isReady) {
        const val = await this.client.get(key);
        if (val) {
          const entry = JSON.parse(val);

          // Tag validation: check if tags have been revalidated since this entry was saved
          if (entry && entry.tags && entry.tags.length > 0) {
            const tagKeys = entry.tags.map((tag) => `tag:${tag}`);
            const revalTimes = await this.client.mGet(tagKeys);

            for (let i = 0; i < entry.tags.length; i++) {
              const revalTime = revalTimes[i];
              if (revalTime) {
                const revalTimestamp = parseInt(revalTime, 10);
                if (revalTimestamp > entry.lastModified) {
                  return null; // Entry is stale!
                }
              }
            }
          }

          return entry.value;
        }
      }
    } catch (err) {
      /* Fall through to in-memory cache fallback */
    }

    if (isBuild && (!this.client || !this.client.isOpen || !this.client.isReady)) {
      return null;
    }

    return getMemoryCache(key);
  }

  async set(key, data, ctx) {
    const ttl = typeof ctx?.revalidate === "number" && ctx.revalidate > 0 ? ctx.revalidate : 604800;

    // Always populate memory cache fallback
    setMemoryCache(key, data, ttl);

    try {
      if (this.client && this.client.isOpen && this.client.isReady) {
        const entry = {
          lastModified: Date.now(),
          value: data,
          tags: ctx?.tags || data?.tags || []
        };
        const payload = JSON.stringify(entry);
        await this.client.set(key, payload, { EX: ttl });
      }
    } catch (err) {
      /* silent fallback */
    }
  }

  async revalidateTag(tag) {
    try {
      if (this.client && this.client.isOpen && this.client.isReady) {
        const now = Date.now();
        await this.client.set(`tag:${tag}`, now.toString());
      }
    } catch (err) {
      console.error("CacheHandler.revalidateTag error:", err);
    }
  }
}

module.exports = CacheHandler;

