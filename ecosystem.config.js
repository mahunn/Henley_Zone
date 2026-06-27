module.exports = {
  apps: [
    {
      name: "henleyzone",
      script: "server.js",
      instances: 6,
      exec_mode: "cluster",
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
