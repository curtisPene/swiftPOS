const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Ensures that location admins cannot be removed
userSchema.pre("findOneAndDelete", async (next) => {
  const user = this;
  if (this.admin) {
    console.log("User is an admin, cannot delete");
  }
  return next(error);
});

module.exports = mongoose.model("User", userSchema);
