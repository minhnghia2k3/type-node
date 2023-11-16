import express from "express";
import { getUsers, deleteUserById, getUserById } from "../db/Users";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params

        // Not check cuz using middlewares

        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        const { username } = req.body;

        if (!username) return res.status(400).json("Field `username` is required!")

        const user = await getUserById(id);
        user.username = username;
        await user.save()

        return res.status(200).json(user)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}