import { getUserById } from "../model/userModel.js";

export const userData = (req, res) => {
    getUserById(req.params.id, async(err, result) => {
        if(err) return res.status(500).json({ message: "Server error", err });
        if(result.length === 0) return res.status(400).json({ message: "No user found."});
        const user = result[0];
        delete user.password; // remove password before sending response
        return res.status(200).json({ user });
    });
}
