import express from "express";
import bodyParser from "body-parser";
import multiparty from "multiparty";

// const multipart = multer();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/

// Serve application file depending on environment
app.get("/app.js", (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + "/build/app.js");
  } else {
    res.redirect("//localhost:9090/build/app.js");
  }
});

// Serve aggregate stylesheet depending on environment
app.get("/style.css", (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + "/build/style.css");
  } else {
    res.redirect("//localhost:9090/build/style.css");
  }
});

app.post("/login", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields) => {
    let username, password;
    
    if(req.body.username && req.body.password) {
      username = req.body.username;
      password = req.body.password;
    } else {
      if(fields && fields.password && fields.password.length === 1
      && fields.username && fields.username.length === 1) {
        username = fields.username[0];
        password = fields.password[0];
      }
    }
    
    if(username === "Matteus" && password === "secret") {
      setTimeout(() => {
        res.json({ message: "success" });
      }, 1000);
    } else {
      res.status(400).json({ error: "Login failed." });
    }
  });
});

// Serve index page
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});


/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const config = require("./webpack.local.config");

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: true,
    historyApiFallback: true
  }).listen(9090, "localhost", (err, result) => {
    if (err) {
      console.log(err);
    }
  });
}


/******************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Essential React listening at http://%s:%s", host, port);
});
