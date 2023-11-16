import express from "express"
import { get, merge } from "lodash"

import { getUserBySessionToken, getUserById } from "../db/Users"

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Get id from request params
        const { id } = req.params

        // Get _id from previous request
        const currentUserId = get(req, "identity._id") as string | undefined;

        if (!currentUserId) return res.status(403).json("User is not logged in yet!")

        if (currentUserId.toString() !== id) return res.sendStatus(403)

        return next()
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Extract cookie
        const sessionToken = req.cookies['minhnghia2k3-AUTH']

        if (!sessionToken) return res.status(403).json("User's not logging yet!")

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) return res.status(403).json("Not found user by session token!")

        // merge existingUser to req object and pass to next middleware
        merge(req, { identity: existingUser })

        return next()
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}
