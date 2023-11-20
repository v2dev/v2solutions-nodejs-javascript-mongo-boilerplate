require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./logger/bunyanLogger.js").child({
  module: "NodeJS boilerplate accelerator",
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    logger.info("MongoDB connected Successfully");
  })
  .catch((err) => {
    logger.error(err.message);
  });
