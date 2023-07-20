import { Router } from "express";
import { userModel } from "../dao/mongo/models/user.model.js";

import passport from 'passport';
const sessions = router();

//Log in 

sessions.post("/login", passport.authenticate('login'), async (req, res) => {
	try {
		const email = req.user.email;
		await userModel.findOne({email});
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email,
		};
		return res.status(200).send({status: 'success', response: 'User loged'});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});
