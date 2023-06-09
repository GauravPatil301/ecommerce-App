// signup a new user
import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler"
import CustomError from "../utils/CustomError"

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}

/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/

export const signUp = asyncHandler(async(req,res) => {
    // get data from user
    const {name, email, password } = req.body

    // validation
    if(!name || !email || !password){
        throw new CustomError("Please add all fields",400);
        // throw new Error("Got an error") - we are using customError
    }

    // let add this data to database

    // check if user already exists
    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError("User already exists",400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTtoken()
    // safety
    user.password = undefined

    // store this token in user's choice
    res.cookie("token",token,cookieOptions)

    // send back to response to user
    res.status(200).json({
        success: true,
        token,
        user,
    })
})

export const login = asyncHandler(async (req,res) => {
    const {email, password} = req.body

    // validation
    if(!email || !password){
        throw new CustomError("Please fill all details", 400)
    }

    const user = User.findOne({email}).select("+password")

    if(!user){
        throw new CustomerError("Invalid credentials",400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
        const token = user.getJWTtoken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new CustomError("Password is incorrect", 400)
})

export const logout = asyncHandler(async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})

export const getProfile = asyncHandler(async (req,res) => {
    const {user} = req
    
    if(!user){
        throw new CustomError("User not found",401)
    }
    
    res.status(200).json({
        success:true,
        user
    })
})