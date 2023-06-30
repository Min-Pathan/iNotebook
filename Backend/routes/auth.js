const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = 'MinazIsAGoodGirl';

//ROUTE 1 : Create a user using : POST "/api/auth/createUser" no login required
router.post('/createUser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),  
    body('password').isLength({ min: 6 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
    .withMessage('Please enter a password at least 6 character and contain At least one uppercase.At least one lower case.At least one special character.')
    ], async (req, res)=>
    {
        let success = false;
        //if there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            return res.status(400).json({success, errors: errors.array() });
        } 
        //check whether the user with the same email exists 
        try 
        {            
            let user = await User.findOne({email : req.body.email})
            if (user)
            {                
                return res.status(400).json({success, error: "User with this email already exists." })
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            //create a new user
            user = await User.create({
                name: req.body.name,            
                password: secPass,
                email: req.body.email,
            });

            const data = {
                user:{
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);            
            // res.json({user})  
            success=true;                      
            res.json({success, authToken});
        } 
        catch (error) 
        { 
            console.error(error.message);
            res.status(500).send("Internal server Error");
        }
    })

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) 
      {
        success = false
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  
  });
  

//ROUTE 3 : Get logged in user's details using : POST "/api/auth/getuser". Login required
router.post('/getuser', fetchUser, [
], async (req, res)=>
{
    try 
    {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } 
    catch (error) 
    {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

module.exports = router