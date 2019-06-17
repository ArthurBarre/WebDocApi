require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const port = 8976;
const employeeController = require('./controllers/employeeController');

var app = express();

app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(bodyparser.json());

app.set('views', path.join(__dirname, '/views/'));
//lien entre l'app et  le moteur de templating handlebars
//on indique la page par féfault et le path vers les différents layouts
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
//on indique qu'on -utilise l'engin de handlebars
app.set('view engine', 'hbs');
//"déploiement de l'app" sur le port 8976
app.listen(port, () => {
  console.log('Express server started at port : ' + port);
});
//on indique qu'on utilise le controller ci dessous pour la génration des fichiers
app.use('/employee', employeeController);