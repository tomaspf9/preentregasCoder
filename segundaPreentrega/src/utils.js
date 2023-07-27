import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_TOKEN = '<TOKEN>';
export const generateToken = (user) => {
	const token = jwt.sign({id: user.id, email: user.email}, JWT_TOKEN, {expiresIn: '1d'});
	return token;
};
// const access_token = generateToken(user);

export const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	if (!authHeader) {
		return res.sendStatus(401);
	};
	const token = authHeader.split(" ")[1];
	jwt.verify(token, JWT_TOKEN, (err, credential) => {
		if (err) {
			return res.sendStatus(403);
		};
		req.user = credential.user;
		next();
	});
};
// app.get("/private", verifyToken, (req,res) => {
// 	res.send("private")
// });

export const createHash = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;