const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { exec } = require("child_process");
const { authenticate, checkSession } = require('./middleware/user-auth');
const dbConnection = require('./config/db-config');

const app = express();
const port = process.env.PORT || 3000;
const db = new dbConnection();
db.getDb().connect(err => {
	if (err) throw err;
	console.log('connected');
	app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	})
});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: 'secret',
	saveUninitialized: false,
	resave: false,
	maxAge: 1000 * 60 * 60,
}));


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', authenticate, (req, res) => {
    res.redirect('/home');
});

app.get('/home', checkSession, (req, res) => {
    res.render('home');
});

app.get('/startServer', checkSession, (req, res) => {
    exec("cd ../serverMinecraft java -jar spigot-1.19.3.jar", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});