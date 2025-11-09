import db from "../config/db.js";

export const createUser = (userData, callback) => {
    const { name, email, password, role } = userData;
    const query = ("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    db.query(query, [name, email, password, role], (err, results) => {
        if (err) {
            console.error("Error creating user:", err);
            callback(err, null);
        } else {
            console.log("User created successfully:", results);
            callback(null, results);
        }
    });
}

export const getUserByEmail = (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("getUserByEmail error:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
}

export const updatPassword = (email, newPassword, callback) => {
    const query = "UPDATE users SET password = ? WHERE email = ?";
    db.query(query, [newPassword, email], (err, results) => {
        if (err) {
            console.error("updatePassword error:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
}

export const getUserById = (id, callback) => {
    const query = "SELECT * FROM users WHERE user_id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("getUserById error:", err);
            return callback(err, null);
        }
        return callback(null, results);
    });
}