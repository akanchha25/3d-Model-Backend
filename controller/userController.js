const env = require("dotenv");
env.config();
const userSchema = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require("uuid");


exports.signup = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(6);


        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            throw ("plz filled all detail")
        }

        const hashPassword = bcrypt.hashSync(password, salt);
        console.log(hashPassword)

        let findUser = await userSchema.findOne({email: email})
        console.log(findUser)
        console.log(findUser.password)

        // let findUser = await userSchema.findOne({ $or: [{ email: email }, { username: username }] })
        if (findUser) {
            res.send("User already exist")
        }
        console.log(findUser)
        const userId = uuidv4();

        user = new userSchema({
            userId,
            username,
            email,
            password:hashPassword,
            
         });
         await user.save();

         res.status(202).send("user created")
    }
    catch (err) {
        //    res.status(500).send(err)
        console.log(err)
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return res.status(422).send({ error: "plz filled all detail" })
        }

        var salt = bcrypt.genSaltSync(6);
        const hash = bcrypt.hashSync(password, salt);
        console.log(hash)

        let findUser = await userSchema.findOne({email: email})
        console.log(findUser)
        const user_id = findUser.userId;
        if (!findUser) {
            res.status(403).json({ error: "user not find" })
        }
        const match = await bcrypt.compare(password, findUser.password);
        if (match === false) {
            return res.json({ message: "Invalid password" });
        }
        else {

            console.log("Logged In")

            console.log(process.env.JWT_SECRET_KEY);
            const token = jwt.sign({ email, user_id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRE_TILL });
            res.status(200).send({ user:`${email} logged in successfully`,token })

        }

    }
    catch (err) {
        console.log(err)
    }

}
exports.valid = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        let token = auth
        if (auth.includes("Bearer")) {
            token = token.split(" ")[1]
            console.log(token)
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decode;
        next();

    }
    catch (err) {
        console.log(err)
        res.status(403).send("invalid token" + err)
    }


}
