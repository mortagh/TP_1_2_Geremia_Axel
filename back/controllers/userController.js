const express = require("express");
const router = express.Router();

const USERS = require("../data/users");
const User = require("../models/userModel");

// get all users
const getAllUsers = (req, res) => {
  res.send(USERS);
};

// get user with id
const getUserById = (req, res) => {
  const user = USERS.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("Utilisateur non trouvé");
  }
  res.send(user);
};

// get user with role
const getUsersByRole = (req, res) => {
  const users = USERS.filter((u) => u.role === req.params.role);
  if (users.length === 0) {
    return res.status(404).send("Aucun utilisateur trouvé avec ce rôle");
  }
  res.send(users);
};

// create user
const createUser = (req, res) => {
  const { name, email, role } = req.body;
  const errors = {};

  // Vérification des champs vides
  if (!name) errors.name = "Le nom est requis";
  if (!email) errors.email = "L'email est requis";
  if (!role) errors.role = "Le rôle est requis";

  // email doit être unique
  if (email) {
    const existingUser = USERS.find((u) => u.email === email);
    if (existingUser) {
      errors.emailDuplicate = "Un utilisateur avec cet email existe déjà";
    }
  }

  // validation du role
  if (role) {
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      errors.roleInvalid =
        "Le rôle doit obligatoirement être 'user' ou 'admin'";
    }
  }

  // toutes les erreurs
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Veuillez corriger les erreurs suivantes",
      details: errors,
    });
  }

  try {
    const newId =
      USERS.length > 0 ? Math.max(...USERS.map((u) => u.id)) + 1 : 1;

    const newUser = new User(newId, name, email, role);

    USERS.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// update user with id
const updateUser = (req, res) => {
  const user = USERS.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("Utilisateur non trouvé");
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;

  if (req.body.role) {
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(req.body.role)) {
      return res
        .status(400)
        .json({ error: "Le rôle doit être 'user' ou 'admin'." });
    }
    user.role = req.body.role;
  }

  user.updatedAt = new Date().toISOString();
  res.send(user);
};

// delete user with id
const deleteUser = (req, res) => {
  const user = USERS.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("Utilisateur non trouvé");
  }
  USERS.splice(USERS.indexOf(user), 1);
  res.send("Utilisateur " + user.name + " supprimé");
};

module.exports = {
  getAllUsers,
  getUserById,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
};
