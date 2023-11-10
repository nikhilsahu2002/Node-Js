const mongoose = require('mongoose');
const uri = 'mongodb+srv://death1233freak:Nikhil1233@nikhil.ya32hpr.mongodb.net/IAS?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected");
}).catch((error)=>{
    console.log("not connected");
})

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
});
  
const User = mongoose.model('User', userSchema);

async function insertUserData() {
    try {
      const newUser = new User({
        username: 'Nikhil',
        email: 'Nikhil1233kumar@gmail.com',
        
      });
  
      const result = await newUser.save();
      console.log('Inserted new user:', result);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
}

async function fetchUserData() {
    try {
      const users = await User.find();
      console.log('Fetched users:', users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  
// insertUserData().then(() => {
//     mongoose.connection.close();
// });

fetchUserData().then(() => {
    // Close the database connection after fetching data (optional)
    mongoose.connection.close();
  });
  
