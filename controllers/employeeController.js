const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

// we render the add Employee item on the "/" route
router.get('/', (req, res) => {
  res.render("employee/addOrEdit", {
    viewTitle: "Insert Employee"
  });
});
//Create part of the crud,
router.post('/', (req, res) => {
  if (req.body._id == '')
    insertRecord(req, res);
  else
    updateRecord(req, res);
});

//permet de créer un employé selon le schéma établi en récupérant la data provenenant du formulaire du component addOrEdit
function insertRecord(req, res) {
  var employee = new Employee();
  employee.fullName = req.body.fullName;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.city = req.body.city;
  employee.save((err, doc) => {
    if (!err)
      res.redirect('employee/list');
    else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render("employee/addOrEdit", {
          viewTitle: "Insert Employee",
          employee: req.body
        });
      }
      else
        console.log('Error during record insertion : ' + err);
    }
  });
}
//cette fonction permet en cliquant sur un l'icone modif. de récupérer l'id de l'item créer dans la base de donnée mongodb puis de l'update 
function updateRecord(req, res) {
  Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
    if (!err) { res.redirect('employee/list'); }
    else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render("employee/addOrEdit", {
          viewTitle: 'Update Employee',
          employee: req.body
        });
      }
      else
        console.log('Error during record update : ' + err);
    }
  });
}

//on render le component list et son contenu sur la route "/list"
router.get('/list', (req, res) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.render("employee/list", {
        list: docs
      });
    }
    else {
      console.log('Error in retrieving employee list :' + err);
    }
  });
});

//cette fonction permet de vérifier les champs fullName et email 
function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'fullName':
        body['fullNameError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}
//permet de render l'interface de modification de l'employé choisi
router.get('/:id', (req, res) => {
  Employee.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("employee/addOrEdit", {
        viewTitle: "Update Employee",
        employee: doc
      });
    }
  });
});
//permet de supprimer un item mongodb en connaissant son id
router.get('/delete/:id', (req, res) => {
  Employee.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect('/employee/list');
    }
    else { console.log('Error in employee delete :' + err); }
  });
});

module.exports = router;