import express from "express";
import { createUser, getUserByEmail } from "../db/Users";
import { authentication, random } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        // Get params from request body
        const { email, password, username } = req.body;
        // Check required fields
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        // Check is email exist in the db
        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.sendStatus(400)
        }

        // Generate random salt
        const salt = random();
        // Create user parse params (email, user, authentication)
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })
        return res.status(200).json(user).end();
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400)
        }

        // Get user by email include salt, password
        const user = await getUserByEmail(email).select('+authentication.salt + authentication.password')
        if (!user) return res.sendStatus(400)

        // Compare user password with hashed-password
        const expectedHash = authentication(user.authentication.salt, password)
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403)
        }

        // If login success => create a user session
        const salt = random()

        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save()

        // Response cookie for user
        res.cookie('minhnghia2k3-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' })

        return res.status(200).json(user).end();
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}