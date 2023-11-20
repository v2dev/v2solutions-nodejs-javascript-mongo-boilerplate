require("dotenv").config();
const app = require("./index.js");
const logger = require("./logger/bunyanLogger.js").child({
  module: "NodeJS boilerplate accelerator",
});

app.listen(process.env.PORT, () => {
  logger.info("Server Connected", process.env.PORT);
});
