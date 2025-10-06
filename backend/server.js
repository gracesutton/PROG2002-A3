
// import the modules
const express=require("express"); // for a webserver (express)
const bodyParser=require("body-parser"); // parse the body of the request
const path=require("path"); // handle file paths

// import the api controller
const apiRouter = require ('./controllerAPI/api-controller.js');

// import the database connection
const connection = require('./event_db.js');

// create a new express webserver app
const app=express();

//to parse URL-encoded data
app.use(bodyParser.urlencoded({extended:true}));

// use the controller for REST endpoints
app.use('/api/events', apiRouter);

//to serve static files
app.use(express.static(__dirname));

//route to serve index.html (load html and send to client)
//first endpoint - using GET message
app.get("/",(req,res)=>{
  // render/send the index.html file
  res.sendFile(path.join(__dirname,"index.html"));
});

//route to serve search.html
app.get("/search",(req,res)=>{
  res.sendFile(path.join(__dirname,"search.html"));
});

//route to serve event.html
app.get("/event",(req,res)=>{
  res.sendFile(path.join(__dirname,"event.html"));
});

// route to fetch events
app.get('/events', (req, res) => {
  connection.query('SELECT * FROM Events', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// start running the webserver on port 8080
app.listen(8080,()=>{
  console.log("Server running at http://localhost:8080");
});