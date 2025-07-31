const { env } = require("process");

const target = "http://localhost:8085/";

const PROXY_CONFIG = [
  {
    context: ["/api"],
    proxyTimeout: 10000,
    target: target,
    secure: false,
    headers: {
      Connection: "Keep-Alive",
    },
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
