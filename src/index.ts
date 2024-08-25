import express from 'express';
import passport from 'passport';
// import connectDB from './db/connect';
const app = express();

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

const port = parseInt( '8080');

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  // const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
  // res.json({ token });
});
console.log('start listening')
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// connectDB();

