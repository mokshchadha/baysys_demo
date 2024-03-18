const express = require("express");
const cors = require("cors");
const { logRequestMiddleware, authKeyMiddleWare } = require("./middlewares");
const routes = require("./src/routes");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use((rq, re, n) => logRequestMiddleware(rq, re, n));
app.use((rq, re, n) => authKeyMiddleWare(rq, re, n));

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
