module.exports = {
  apps: [
    {
      name: "icchaporon-invoice-server",
      script: "./src/server.js",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
