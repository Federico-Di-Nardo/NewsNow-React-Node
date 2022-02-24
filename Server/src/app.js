import express from "express";
import config from "./config.js";
import userRoutes from "./routes/user.routes.js";
import savedNewsRoutes from "./routes/savedNews.routes.js";
import newsRoutes from "./routes/news.routes.js";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { dbSettings } from "./model/connection.js";
var MSSQLStore = require('connect-mssql')(session);

const app = express();

app.set("port", config.port);

app.use(
  cors({
    // CHANGE to local env variable
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session
app.use(session({
  key: "userID",
  secret: config.session_secret,
  saveUninitialized:true,
  resave: false,
  store: new MSSQLStore(dbSettings),
}));

// cookie parser
app.use(cookieParser())

app.use(userRoutes);
app.use(savedNewsRoutes);
app.use(newsRoutes);

export default app;