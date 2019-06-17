const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

//permet de render le template addOrEdit 
router.get('/', (req, res) => {
  res.render("../views/employee/addOrEdit", {
    viewTitle: 'Insert new employee'
  })
});
//permet d'envoyer les données dans la db
router.post('/', (req, res) => {
  insertRecord(req, res)
})
//récupere le model de db,créer un employé "avec un modèle vide“ utilses les données du form et les enregistrent avec la fonction save()
function insertRecord(req, res) {
  var employee = new Employee();
  employee.fullName = req.body.fullName;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.city = req.body.city;
  employee.save((err, doc) => {
    //si il n'y a pas d'erreur on me redirige vers le chemin employee/list
    if (!err) {
      res.redirect('/employee/list');
    } else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render("../employee/addOrEdit", {
          viewTitle: 'Insert new employee',
          employee: req.body
        })
      } else {
        console.log('oups: ' + err)
      }

    }
  });
}
//on injecte dans la route les données de la liste des employés
router.get('/list', (req, res) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.render('employee/list', {
        list: docs
      })
    } else {
      console.log('Errors in retrieving employee list: ' + err)
    }
  }
  )
})

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'fullName':
        body['fullNameError'] = err.errors[field].message
        break
      case 'email':
        body['emailError'] = err.errors[field].message
        break
      default:
        break
    }
  }
}
module.exports = router;
