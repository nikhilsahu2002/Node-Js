const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const app = express();
const port = process.env.PORT || 10000; // Choose an appropriate port

const uri = 'mongodb+srv://death1233freak:Nikhil1233@nikhil.ya32hpr.mongodb.net/IAS?retryWrites=true&w=majority';

app.set('view engine', 'ejs');
app.set('views', __dirname + '/template');
app.use(session({
    secret: 'your-secret-key', // Change this to a strong, random string
    resave: false,
    saveUninitialized: true,
  }));

// Mongoose setup and model definition
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Add a password field to the schema
});

const User = mongoose.model('User', userSchema);

// Middleware to check if the user is logged in
const checkLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Define an API endpoint to fetch user data
app.get('/api/User', async (req, res) => {
    try {
      const users = await User.find();
      console.log('Fetched users:', users);
      res.json(users);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(port).json({ error: 'An error occurred while fetching data.' });
    }
});

// Serve the HTML page when the root path is accessed
app.get('/', checkLoggedIn, async (req, res) => {
    try {
      const users = await User.find();
      res.render('index', { users, user: req.session.user }); // Pass 'users' and 'user' to the EJS template
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while rendering the page.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.urlencoded({ extended: true }));

app.get('/register', async (req, res) => {
    res.render('registration', { message: '', error: '' });
  });

  
  app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      // Check if the username already exists in the User model
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.render('registration', { message: '', error: 'Username already exists' });
      }
  
      // Create a new user using the User model
      const newUser = new User({
        username,
        email, // You can add an email field if needed
        password, // Store the plain text password provided by the user
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Store user data in the session
      req.session.user = {
        username: newUser.username,
        // Add other user-related data if needed
      };
  
        res.redirect('/');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
  });
  

app.post('/logout', (req, res) => {
    // Clear the user session data to log them out
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'An error occurred during logout.' });
      }
  
      // Redirect the user to the login or home page after logout
      res.redirect('/login');
    });
});
app.get('/login', async (req, res) => {
    res.render('login', { error: '' });
  });

  
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists in the User model
        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res.render('login', { error: 'User not found' });
        }

        // Compare the entered password with the password stored in the database
        if (password !== existingUser.password) {
            return res.render('login', { error: 'Incorrect password' });
        }

        // Store user data in the session
        req.session.user = {
            username: existingUser.username,
            // Add other user-related data if needed
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});
