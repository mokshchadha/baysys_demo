const configs = require("./configs");

const authKeyMiddleWare = (req, res, next) => {
  // if (configs.NODE_ENV === "development") {
  //   next();
  //   return;
  // }
  const authKey = req.headers["auth-key"];
  if (!authKey) {
    console.log("Auth key is missing in headers");
    return res.status(401).json({ error: "Unauthorized: Auth key is missing" });
  }
  if (authKey !== configs.AUTH_KEY) {
    console.log("Auth key is invalid");
    return res.status(401).json({ error: "Unauthorized: Invalid auth key" });
  }
  next();
};

const logRequestMiddleware = (req, _, next) => {
  const url = req.url;
  const body = req.body;
  const currentTime = new Date();
  const utcTime = currentTime.toISOString();
  console.log(
    `\x1b[34m[${utcTime}]\x1b[0m:\x1b[33m[${req.method}]${url}\x1b[0m`
  );
  if (body) console.log(JSON.stringify(body));
  next();
};

module.exports = { logRequestMiddleware, authKeyMiddleWare };
