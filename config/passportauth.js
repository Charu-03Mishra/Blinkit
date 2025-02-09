const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../model/user");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/callback",
		},
		async function (accessToken, refreshToken, profile, cb) {
			try {
				let user = await User.findOne({ email: profile.emails[0].value });
				if (!user) {
					user = new User({
						name: profile.displayName,
						email: profile.emails[0].value,
					});
					await user.save();
				}
				cb(null, user);
			} catch (error) {
				cb(error, false);
			}
		}
	)
);

passport.serializeUser((user, cb) => {
	return cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
	let user = await User.findOne({ _id: id });
	cb(null, user);
});
