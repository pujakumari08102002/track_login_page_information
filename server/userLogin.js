const mongoose = require("mongoose");
const { string } = require("request-ip/lib/is");

const UserLoginSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo", 
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "india",
    },
    region: {
      type: String,
      default: "india",
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    osType:string,
  },
  {
    collection: "UserLogin",
  }
);

module.exports = mongoose.model("UserLogin", UserLoginSchema);
