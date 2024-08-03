const app = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, { dbName: "swift_pos" })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Listening on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
