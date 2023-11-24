require("dotenv").config();
const app = require("./index.js");
const logger = require("./logger/bunyanLogger.js").child({
  module: "NodeJS boilerplate accelerator",
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("Server Connected", PORT);
});
