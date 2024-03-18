const CUSTOM_ERRORS = require("./errors");

async function routeHandler(req, res, buisnessLogicFn) {
  try {
    const result = await buisnessLogicFn(req);
    res.status(200).json(result).end();
  } catch (error) {
    const customErr = CUSTOM_ERRORS[error.toString()];
    if (customErr) {
      console.error(customErr);
      res
        .status(customErr.status)
        .json({
          code: error.toString(),
          type: customErr.type,
          msg: customErr.message,
        })
        .end();
      return;
    }
    console.error(error);
    res
      .status(500)
      .json({ code: error, type: "undefined", msg: error.toString() })
      .end();
  }
}

module.exports = routeHandler;
