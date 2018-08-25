
require('dotenv').config();
var bparse = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();
var port = process.env.PORT;

app.use(express.static("./public"));

app.use(bparse.urlencoded({ extended: true }));
app.use(bparse.text());
app.use(bparse.json());
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
require('./controllers/homeController')(app);
 
app.listen(port, function() {
    console.log(`Connected on port: ${port}`);
});
