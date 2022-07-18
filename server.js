const express = require('express');
const path = require('path')

const routes = require('./controllers');
const sequelize = require('./config/connections');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'supersupersecret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}

app.use(session(sess))

const helpers = require('./utils/helper');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// express middleware
// parses incoming json request and this data in a req.body
app.use(express.json());
//  parses incoming requests with urlencoded payloads and is based on body-parser
app.use(express.urlencoded({ extanded: true }));
// takes all of the content inside the folder and serve them as static assets
app.use(express.static(path.join(__dirname, 'public')))

// turn on routes
app.use(routes);

// turn on connection to db and server 
sequelize.sync({ force: false}).then(() => {
    app.listen(PORT, () => console.log(`Now Listening on ${PORT}`))
})