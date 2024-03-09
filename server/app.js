const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserAgent = require("useragent");
const requestIp = require("request-ip");
const cors = require("cors");
const geoip = require("geoip-lite");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const mongoUrl = process.env.MONGODB_URL;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

  app.listen(5000, () => {
    console.log("Server Started");
  });
  

require("./userDetails");
require("./userLogin");

const User = mongoose.model("UserInfo");
const UserLogin = mongoose.model("UserLogin");


app.use(async (req, res, next) => {
  try {
    const agent = UserAgent.parse(req.headers["user-agent"]);
    const ip = requestIp.getClientIp(req); 
    // console.log("User Agent:", agent.toString());
    // console.log("IP Address:", ip);
    // const geo = geoip.lookup(ip);
    // console.log("Country:", geo ? geo.country : "Unknown");
    // console.log("Region:", geo ? geo.region : "Unknown")
    const userId = req.headers["user-id"] || req.body.userId;
    if (userId) {
      await userLogin.create({
        userId: userId,
        userAgent: agent.toString(),
        ipAddress: ip,
        country: geo ? geo.country : "Unknown",
        region: geo ? geo.region : "Unknown",
        loginTime: new Date(),
      });
    }

    next();
  } catch (error) {
    console.error("Error tracking user details:", error);
    next(error);
  }
});


app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});


const os = require('os');
const userLogin = require("./userLogin");


app.post("/login-user", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "15m",
      });
      const agent = UserAgent.parse(req.headers["user-agent"]);
      const ip = req.ip;
      if (!ip) {
        console.error("Unable to retrieve client IP address");
        return res.json({ status: "error", error: "Unable to retrieve IP address" });
      }
      const geo = geoip.lookup(ip);
      if (!geo) {
        // console.error("Unable to perform GeoIP lookup");
      }
      const osType = os.type();
      await userLogin.create({
        userId: user._id,
        userAgent: agent.toString(),
        ipAddress: ip,
        country: geo ? geo.country : "Unknown",
        region: geo ? geo.region : "Unknown",
        osType: osType,
        loginTime: new Date(),
      });
      console.log("Country:", geo ? geo.country : "Unknown");
      return res.json({ status: "ok", data: user._id });
    } else {
      return res.json({ status: "error", error: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.json({ status: "error", error: "Internal server error" });
  }
});

app.get('/user/:id', async (req, res) => {
  const userId = req.params.id; 
  try {
    const user = await User.findOne({ _id:userId }); 
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "ok", data: user }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});



app.get("/userdetail/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; 
    if (!userId) {
      return res.status(400).send("Bad request"); 
    }
    const userData = await UserLogin.find({ userId: userId });
    if (!userData) {
      return res.status(404).send("User not found"); 
    }
    res.send(userData); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error"); 
  }
});

