const express = require("express");
const users = require("../inc/users");
const admin = require("../inc/admin");
const menus = require("../inc/menus");
const reservations = require("../inc/reservations");
const contacts = require("../inc/contacts");
const emails = require("../inc/emails");
const moment = require("moment");
const router = express.Router();

module.exports = function (io) {
  router.use(function (req, res, next) {
    if (["/login"].indexOf(req.url) == -1 && !req.session.user) {
      res.redirect("/admin/login");
    } else {
      next();
    }
  });

  router.use(function (req, res, next) {
    req.menus = admin.getMenus(req);

    next();
  });

  router.get("/", function (req, res, next) {
    admin
      .dashboard()
      .then((data) => {
        res.render(
          "admin/index",
          admin.getParams(req, {
            data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get("/dashboard", function (req, res, next) {
    reservations
      .dashboard()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get("/login", function (req, res, next) {
    users.render(req, res);
  });

  router.post("/login", function (req, res, next) {
    if (!req.body.email) {
      users.render(req, res, "Insira o email");
    } else if (!req.body.password) {
      users.render(req, res, "Insira a senha");
    } else {
      users
        .login(req.body.email, req.body.password)
        .then((user) => {
          req.session.user = user;
          res.redirect("/admin");
        })
        .catch((err) => {
          users.render(req, res, err);
        });
    }
  });

  router.get("/logout", function (req, res, next) {
    delete req.session.user;
    res.redirect("/admin/login");
  });

  router.get("/contacts", function (req, res, next) {
    contacts
      .getContacts()
      .then((data) => {
        res.render(
          "admin/contacts",
          admin.getParams(req, {
            data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.delete("/contacts/:id", function (req, res, next) {
    contacts
      .delete(req.params.id)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get("/emails", function (req, res, next) {
    emails
      .getEmails()
      .then((data) => {
        res.render(
          "admin/emails",
          admin.getParams(req, {
            data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.delete("/emails/:id", function (req, res, next) {
    emails
      .delete(req.params.id)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get("/menus", function (req, res, next) {
    menus
      .getMenus()
      .then((data) => {
        res.render(
          "admin/menus",
          admin.getParams(req, {
            data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.post("/menus", function (req, res, next) {
    menus
      .save(req.fields, req.files)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  router.delete("/menus/:id", function (req, res, next) {
    menus
      .delete(req.params.id)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get("/reservations", function (req, res, next) {
    let start = req.query.start
      ? req.query.start
      : moment().subtract(34, "year").format("YYYY-MM-DD");
    let end = req.query.end ? req.query.end : moment().format("YYYY-MM-DD");

    reservations.getReservations(req).then((pag) => {
      res.render(
        "admin/reservations",
        admin.getParams(req, {
          date: {
            start,
            end,
          },
          data: pag.data,
          moment,
          links: pag.links,
        })
      );
    });
  });

  router.post("/reservations", function (req, res, next) {
    req.query.start = req.query.start
      ? req.query.start
      : moment().subtract(1, "year").format("YYYY-MM-DD");
    req.query.end = req.query.end
      ? req.query.end
      : moment().format("YYYY-MM-DD");

    reservations
      .save(req.fields, req.files)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  router.delete("/reservations/:id", function (req, res, next) {
    reservations
      .delete(req.params.id)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get("/reservations/chart", function (req, res, next) {
    req.query.start = req.query.start
      ? req.query.start
      : moment().subtract(34, "year").format("YYYY-MM-DD");
    req.query.end = req.query.end
      ? req.query.end
      : moment().format("YYYY-MM-DD");

    reservations.chart(req).then((data) => {
      res.send(data);
    });
  });

  router.get("/users", function (req, res, next) {
    users
      .getUsers()
      .then((data) => {
        res.render(
          "admin/users",
          admin.getParams(req, {
            data,
          })
        );
      })
      .catch((err) => {});
  });

  router.post("/users", function (req, res, next) {
    users
      .save(req.fields)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  router.post("/users/password-change", function (req, res) {
    users
      .changePassword(req)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        res.send({error: err});
      });
  });

  router.delete("/users/:id", function (req, res, next) {
    users
      .delete(req.params.id)
      .then((results) => {
        io.emit("dashboard update");
        res.send(results);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  return router;
};
