const userSchema = require("../models/user");

// Getting the user by his Id middleware , passing the user details by req.profile

exports.getUserById = (req, res, next, id) => {
    userSchema.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No user was found in DB"
        });
      }
      req.profile = user;
      next();
    });
  };
  exports.getUser = (req,res) => {
    return res.json(req.profile)
  }

  // Checking if the user is an admin to check if he can delete a user 

  exports.isAdmin = (req, res, next, id) => {
    userSchema.findById(id).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "No user was found in DB"
          });
        }
        if(user.role === 0){
            return res.json("You dont have permission to delete user")
        }
        next();
      });
  }

// creating a user 

exports.createUser = (req, res) => {
    const user = new userSchema(req.body);
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          err: "NOT able to save user in DB"
        });
      }
      res.json({
        user
      });
    });
  };


  // getting all the users

  exports.getAllUsers = (req,res,next) => {

    userSchema.find().
    exec( (err , users) => {
        if(err || !users){
            return res.json("Users not found")
        }
        return res.json({users})
       
    } )

  }

  // Updating a user 

  exports.updateUser = (req, res) => {
    userSchema.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Error updated the user"
          });
        }
        user.salt = undefined;
        user.encry_password = undefined;
        res.json(user);
      }
    );
  };

  // Deleting a user

  exports.deleteUser = (req, res) => {
    const user = req.profile;
  
    user.remove((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete this user"
        });
      }
      res.json({
        message: "Successfull deleted"
      });
    });
  };

  // Getting all the friends of a user


  exports.getAllFriends = async (req,res) => {

   const users = await userSchema.find();

   const friends = req.profile.Friends

   const [lat,long] = req.profile.Address

   console.log(lat,long);

  const displayFrineds =  users.map((data,i) => {
   if( friends.indexOf(data._id) !== -1 && data !== null ) {
            return data
   }
   }  )

   const removeNullAndDisplay = displayFrineds.filter( (data,i) => {
           if(data  !== null){
               return data
           }
       } )
  return res.json(removeNullAndDisplay)


  }

  // Getting all the Friends of a user in ( 1 km ) Radius , Radius can also be changed .


  exports.getAllFriendsNearME = async (req,res) => {

    

    const users = await userSchema.find();

   const friends = req.profile.Friends

   const [lat,long] = req.profile.Address

   console.log(lat,long);

  const displayFrineds =  users.map((data,i) => {


   if( friends.indexOf(data._id) !== -1 ) {
       // checking if user's friend is in Given Radius
            if( getDistanceFromLatLonInKm(lat,long,data.Address[0],data.Address[1]).toFixed(3) < req.params.radius  ){
           return data
            }
   }  
   }  )

   const removeNullAndDisplay = displayFrineds.filter( (data,i) => {
    if(data  !== null){
        return data
    }
} )
return res.json(removeNullAndDisplay)


  }

  // Algorithm to get distance between 2 users 

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }