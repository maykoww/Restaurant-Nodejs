const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const NedbStore = require("connect-nedb-session")(session);
const formidable = require("formidable");
const { Server } = require("http");
const socket = require("socket.io");
const cors = require('cors');
const dotenv = require("dotenv/config");

const app = express();

const http = new Server(app);
const io = socket(http);

io.on("connection", function (socket) {
  console.log("CONNECTED", socket.id);
});

// app.use(cors({
//   origin: 'https://restaurantnodejs.herokuapp.com'
// }));

const indexRouter = require("./routes/index")(io);
const adminRouter = require("./routes/admin")(io);

app.use(function (req, res, next) {
  req.body = {};

  if (req.method === "POST") {
    const form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, "/public/images"),
      keepExtensions: true,
    });

    form.parse(req, function (err, fields, files) {
      req.body = fields;
      req.fields = fields;
      req.files = files;

      next();
    });
  } else {
    next();
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionPath =
  process.env.APP_SESSION_FILE_PATH || path.resolve(__dirname, "sessions.db");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 365 * 24 * 3600 * 1000, // One year for example
    },
    store: new NedbStore({ filename: sessionPath }),
  })
);

app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "public")));

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

http.listen(process.env.PORT, function () {
  console.log("started");
});
