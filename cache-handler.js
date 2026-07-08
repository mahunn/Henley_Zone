const { createClient } = require("redis");

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
        global.redisClient = createClient(clientOptions);
        
        let loggedRefused = false;

        global.redisClient.on("error", (err) => {
          if (err.code === "ECONNREFUSED" && !process.env.REDIS_URL) {
            if (!loggedRefused) {
              console.warn("Redis: local server not running on 127.0.0.1:6379 (caching disabled).");
              loggedRefused = true;
            }
            return;
          }
          console.error("Redis Client Error:", err.message || err);
        });

        global.redisClient.connect().catch((err) => {
          if (err.code === "ECONNREFUSED" && !process.env.REDIS_URL) {
            return;
          }
          console.error("Redis connection failed:", err.message || err);
        });
      } catch (err) {
        console.error("Redis client initialization failed, caching disabled:", err.message || err);
        // Fallback to a mock client that doesn't crash the server
        global.redisClient = {
          isOpen: false,
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
    try {
      if (!this.client.isOpen) return null;
      const val = await this.client.get(key);
      if (!val) return null;

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
    } catch (err) {
      const isBuild = process.env.NEXT_PHASE === "phase-production-build";
      if (!isBuild || process.env.REDIS_URL) {
        console.error("CacheHandler.get error:", err);
      }
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
      if (!this.client.isOpen) return;

      const entry = {
        lastModified: Date.now(),
        value: data,
        tags: ctx?.tags || data?.tags || []
      };

      const ttl = ctx?.revalidate;
      const payload = JSON.stringify(entry);

      if (typeof ttl === "number" && ttl > 0) {
        await this.client.set(key, payload, { EX: ttl });
      } else {
        // Cache indefinitely or set a long default (e.g. 1 week) to avoid memory bloating
        await this.client.set(key, payload, { EX: 604800 });
      }
    } catch (err) {
      const isBuild = process.env.NEXT_PHASE === "phase-production-build";
      if (!isBuild || process.env.REDIS_URL) {
        console.error("CacheHandler.set error:", err);
      }
    }
  }

  async revalidateTag(tag) {
    try {
      if (!this.client.isOpen) return;
      const now = Date.now();
      await this.client.set(`tag:${tag}`, now.toString());
    } catch (err) {
      console.error("CacheHandler.revalidateTag error:", err);
    }
  }
}

module.exports = CacheHandler;
