const express = require("express")

const Router = express.Router();

const {createUser, getUserById , updateUser , getUser , deleteUser , getAllUsers , isAdmin , getAllFriendsNearME , getAllFriends } = require("../controllers/user")
// Get User By Id param 
Router.param(":id",  getUserById)

// Checking if user is an admin

Router.param(":admin" , isAdmin  )

// route to create a user

Router.post("/create/user" , createUser );

// Get User By Id

Router.get("/getuser/:id" , getUser  );

//get all users

Router.get("/getallusers" ,  getAllUsers );

// Updaing a user by providing his id as a param 

Router.put("/updateuser/:id"  , updateUser );

// deleteing a user by checking if the deleter is admin

Router.delete("/deleteUser/:admin/:id"  , deleteUser);
 
// Get All Friends of a User

Router.get("/getfriends/:id" , getAllFriends  )

// get all Frinds within the given radius

Router.get("/getfriendsnearme/:id/:radius" , getAllFriendsNearME )




module.exports = Router;