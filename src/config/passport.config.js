import passport from "passport";
import GitHubStrategy from "passport-github2";
import userService from "../dao/models/users.model.js";

const GITHUB_CLIENT_ID = "Iv1.a6b3e257ff3510f8";
const GITHUB_CLIENT_SECRET = "58389f059189988542147d23f2ec4fde9a1200c6";
const initializePassport = () => {
    passport.use(
        "github",
        new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: `http://localhost:3000/api/sessions/githubcallback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                let user = await userService.findOne({
                    email: profile?.emails[0]?.value,
                });
                if (!user) {
                    const newUser = {
                        first_name: profile.displayName,
                        last_name: profile.displayName,
                        email: profile.emails[0].value,
                        age: 18,
                        password: "",
                    };
                    let result = await userService.create(newUser);
                    done(null, result);
                } else {
                    done(null, user);
                }
            } catch (err) {
                done(err, null);
            }
        }
        )
    );
};

export default initializePassport;