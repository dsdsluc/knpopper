const express = require('express')
const app = express();
const flash = require('express-flash');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const system = require("./configs/system");
const port = process.env.PORT;
const routerClient = require("./routers/clients/index.router");
const routerAdmin = require("./routers/admin/index.router");
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");



// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))  


// database
const database = require("./configs/database");
database.connect();

//Socket IO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;


// Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());


//tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


// public
app.use(express.static(path.join(__dirname, 'public')))

//Router
routerClient(app);
routerAdmin(app);

// template engines
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.locals.prefixAdmin = system.prefixAdmin

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})