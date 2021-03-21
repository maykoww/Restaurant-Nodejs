var menus         = require('../inc/menus');
var reservations  = require('../inc/reservations');
var contacts      = require('../inc/contacts');
var emails        = require('./../inc/emails');
var express       = require('express');
var router        = express.Router();

module.exports = function(io) {

  /* GET home page. */
  router.get('/', function(req, res, next) {

    menus.getMenus().then(results=>{
      res.render('index', {
        title: 'Restaurante',
        background: 'images/img_bg_1.jpg',
        h1: 'Restaurante !',
        menus: results,
        isHome: true
      })
    });

  });

  router.get('/contacts', function (req, res, next) {

    contacts.render(req, res);

  });

  router.post('/contacts', function(req, res, next) {

    if(!req.body.name) {
      contacts.render(req, res, "Informe seu nome");
    }else if(!req.body.email) {
      contacts.render(req, res, "Informe o email");
    } else if(!req.body.message) {
      contacts.render(req, res, "Informe a mensagem");
    } else {
      contacts.save(req.body).then(()=>{
        io.emit('dashboard update');
        io.emit('dashboard contacts');
        contacts.render(req, res, null, "Mensagem enviada com sucesso");
      }).catch(err => {
        console.log(err);
      });
    }

  });

  router.get('/menus', function (req, res, next) {

    menus.getMenus().then(results=>{
      res.render('menu', {
        title: 'Menu',
        background: 'images/img_bg_1.jpg',
        h1: 'Nosso menu!',
        menus: results
      });
    });

  });

  router.get('/reservations', function (req, res, next) {

    reservations.render(req, res);

  });

  router.post('/reservations', function (req, res, next) {

      if(!req.body.name) {
        reservations.render(req, res, "Informe o nome");
      } else if(!req.body.email) {
        reservations.render(req, res, "Informe o email");
      } else if(!req.body.people) {
        reservations.render(req, res, "Informe o número de pessoas");
      } else if(!req.body.date) {
        reservations.render(req, res, "Informe uma data");
      } else if(!req.body.time) {
        reservations.render(req, res, "Informe o horário");
      } else {
        reservations.save(req.body).then(()=> {
          io.emit('dashboard update');
          reservations.render(req, res, null, "Reserva efetuada com sucesso");
        }).catch(err => {
          console.log(err);
        });
      }


  });

  router.get('/services', function (req, res, next) {

    res.render('services', {
      title: 'Serviços',
      background: 'images/img_bg_1.jpg',
      h1: 'É um prazer poder servir!'
    });

  });

  router.post('/emails', function(req, res, next) {
    if (!req.body.email) {
      menus.getMenus().then(results=>{
        res.render('index', {
          title: 'Restaurante',
          background: 'images/img_bg_1.jpg',
          h1: 'Nosso menu!',
          menus: results,
          error: 'Insira seu email'
        });
      });
    } else {
      emails.save(req.body).then(data => {
        io.emit('dashboard update');
        io.emit('dashboard emails');
        menus.getMenus().then(results=>{
          res.render('index', {
            title: 'Restaurante',
            background: 'images/img_bg_1.jpg',
            h1: 'Nosso menu!',
            menus: results,
            success: 'Email registrado com sucesso'
          });
        });

      }).catch(err => {
        console.log(err);
      });

    }

  });

  return router;

};
