import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from './models/user'; // Assuming you have a User model

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret', // Replace with your actual secret key
//   issuer: 'accounts.examplesoft.com',
//   audience: 'yoursite.net'
};

passport.use(new JwtStrategy(opts, (jwtPayload: any, done: any) => {
  User.findOne({ _id: jwtPayload.sub }, (err: any, user: any) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));
