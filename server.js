//Initialize the express app
const express = require('express');
const app = express();

//Grab the port from our .env
const PORT = process.env.PORT || 8080;

//Use json for sending, and include the stylings 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./app/public'));

//Create express app route listeners for html/apis
require('./app/routing/apiRoutes.js')(app);
require('./app/routing/htmlRoutes.js')(app);

//Tell express app to start listening for these routes on this port
app.listen(PORT, function() {
  console.log('App listening on PORT ' + PORT);
});
