const mongoose = require('mongoose');


// après avoir  créer ma db avec le client, j'y fais le lien avec la fonction ci-dessous

mongoose.connect('mongodb://localhost:27017/EmployeeDB', { useNewUrlParser: true }, (err) => {
  if (!err) {
    console.log('its alright')
  } else {
    console.log('it\'s sadly return nothing' + err)
  }
})
//on récupère le modèle mais je sais pas trop à quoi ça sert à cet endroit précis
require('./employee.model')