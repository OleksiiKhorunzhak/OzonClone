const { env } = require("process");

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}/api`
  : env.ASPNETCORE_URLS
  ? env.ASPNETCORE_URLS.split(";")[0]
  : "https://litak-temp-ca.whitedesert-053b82c7.westeurope.azurecontainerapps.io/api";

const PROXY_CONFIG = [
  {
    context: ["/options"],
    proxyTimeout: 10000,
    target: target,
    secure: false,
    headers: {
      Connection: "Keep-Alive",
    },
  },
];

module.exports = PROXY_CONFIG;
