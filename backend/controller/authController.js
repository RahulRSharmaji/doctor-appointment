import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, updatPassword } from "../model/userModel.js";

export const registerUser = (req, res) => {
   
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        if(!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ message: "All fields are required."});
        }

        if(password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match."});
        }

        getUserByEmail(email, async(err, result) => {
            if(err) return res.status(500).json({ message: " Server error", err });
            if(result && result.length > 0) return res.status(400).json({ message: "Email already in use."});
            console.log('here 21');
            
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                createUser({ name, email, password: hashedPassword, role }, (err2) => {
                    if (err2) {
                        console.error("createUser error:", err2);
                        return res.status(500).json({ message: "failed to register user", err2 });
                    }
                    return res.status(201).json({ message: "User Registered successfully." });
                });
            } catch (hashErr) {
                console.error("hash error:", hashErr);
                return res.status(500).json({ message: "Server error", hashErr });
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

export const loginUser = (req,res) => {
    const { email, password } = req.body;

    if(!email || !password)
        return res.status(400).json({ message: "All fields are required."});

    getUserByEmail (email, async(err, result) => {
        if(err) return res.status(500).json({ message: "Server error", err });
        if(result.length === 0) return res.status(400).json({ message: "Invalid credentials."});

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials."});

        const token = jwt.sign({ id:user.id, role: user.role }, process.env.JWT_SECRET, { 
            expiresIn: "1d"
        });

        return res.status(200).json({ message: "Login successful.", token })
    })
}

export const changePassword = (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword)
        return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "New passwords do not match" });

    getUserByEmail(email, async (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (result.length === 0) return res.status(400).json({ message: "User not found" });

        const user = result[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        updatePassword(email, hashed, (err2) => {
        if (err2) return res.status(500).json({ message: "Failed to update password" });
        res.status(200).json({ message: "Password updated successfully" });
        });
    });
};