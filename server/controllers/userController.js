import sendEmail from '../config/sendEmail.js'
import userModel from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import generateAccessToken from '../utils/generateAccessToken.js'
import uploadAvatar from '../utils/uploadAvatarCloudinary.js'
import generateOTP from '../utils/generateOTP.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'

// user register api controller
export default async function registerUserController(request, response) {
  try { 
    const { name, email, password } = request.body
    if(!name || !email || !password) { 
      response.status(400).json({
        message: 'Please enter Name, Email and Password',
        error: true,
        success: false
      })
    }

    // if user already exists
    const userEmailPresent = await userModel.findOne({email})
    if(userEmailPresent) { 
      return response.json({
        message: 'Email Already Registered!!',
        Error: true,
        success: false
      })
    }

    // encrypt the password
    const passSalt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password, passSalt)

    // payload to store in DB
    const payload = { 
      name,
      email,
      password: hashPassword
    }

    // save new user in DB
    const newUser = new userModel(payload)
    const saveUser = await newUser.save()

    const verifyEmailURL = `${process.env.FRONTEND_URL}/verify-email?code=${saveUser?._id}`

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: 'Verification Email from One Cart',
      html: verifyEmailTemplate({
        name,
        url: verifyEmailURL
      })
    })

    return response.json({
      message: 'User Registered Successfully',
      error: false,
      success: true,
      data: saveUser
    })
  }
  catch(error) { 
    return response.error( 500 ).json({ 
      message: error.message || error,
      error: true,
      success: false
    })
  }
} 

// user verfiy api controller
export async function verifyUserController(request, response) { 
  try { 
    const userCode = request.body 
    const verifiedUser = await userModel.findOne({_id: userCode})

    if(!verifiedUser) { 
      return response.status(400).json({
        message: 'Invalid Code',
        error: true,
        success: false
      })
    }

    const updateUserFields = await userModel.updateOne({_id: userCode}, {
      verify_email: true
    })

    return response.json({
      message: 'Email Verified Successfully',
      error: false,
      success: true
    })
  }
  catch(error) {     
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// login user api controller
export async function loginController(request, response) {
  try { 
    const { email, password } = request.body

    if(!email || !password) { 
      return response.status(400).json({
        message: 'Provide Email and Password',
        error: true,
        success: false
      })
    }

    //checking in DB if user exist or not
    const userExist = await userModel.findOne({email})

    if(!userExist) { 
      return response.status(400).json({
        message: 'User not Registered, Please Sign Up with this Email Id',
        error: true,
        success: false
      })
    }

    if(userExist.status !== 'Active') {
      return response.status(400).json({
        message: 'User not Active, Please Contact Admin',
        error: true,
        success: false
      })
    }

    const checkPassword = await bcryptjs.compare(password, userExist.password)
    if(!checkPassword) { 
      return response.status(400).json({
        message: 'Password incorrect',
        error: true,
        success: false
      })
    }

    const accessToken = await generateAccessToken(userExist._id)
    const refreshToken = await generateRefreshToken(userExist._id)

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
     }

    response.cookie('accessToken', accessToken, cookiesOptions)
    console.log(response, "adding cookie");
    
    response.cookie('refreshToken', refreshToken, cookiesOptions)

    return response.json({
      message: 'Login successfull',
      error: false,
      success: true,
      data: { 
        accessToken,
        refreshToken
      }
    })
  }
  catch(error) { 
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// logout user api controller
export async function logoutController(request, response) { 
  try { 
    const Id = request.userId // from middleware
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
     }

    response.clearCookie('accessToken',cookiesOptions)
    response.clearCookie('refreshToken',cookiesOptions)

    const removeRefreshToken = await userModel.findByIdAndUpdate(Id, { refresh_token: '' })

    return response.json({
      message: 'Logout successfull',
      error: false,
      success: true
    })
  }
  catch(error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// upload user avatar controller
export async function uploadAvatarController(request, response) { 
  try { 
    const Id = request.userId // from auth middleware
    const image = request.file // from multer middleware
    const upload = await uploadAvatar(image)

    // adding avatar url in db
    const updateAvatarDB = await userModel.findByIdAndUpdate(Id, { avatar: upload.url})

    return response.json({
      message: 'Profile Picture Uploaded Successfully',
      data: {
        _id: Id,
        avatar: upload.url
      }
    })
  }
  catch(error) { 
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// update user data controller
export async function updateUserDataController(request,response) { 
  try{
    const userId = request.userId // auth middleware
    const { name, email, mobile, password } = request.body
    
    let hashPassword = ''

    if(password) { 
      const passSalt = await bcryptjs.genSalt(10)
      hashPassword = await bcryptjs.hash(password, passSalt)
    }

    const updateUser = await userModel.updateOne( {_id: userId}, {
      ...(name && {name:name}),
      ...(email && {email:email}),
      ...(mobile && {mobile: mobile}),
      ...(password && {password: hashPassword})
    })

    return response.json({
      message: 'Profile Details Updated Successfuly',
      error: false,
      success: true,
      data: updateUser
    })
  }
  catch(error) { 
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
} 

//forgot password controller
export async function forgotPasswordController(request,response) {
  try { 
    const {email} = request.body    
    const user = await userModel.findOne({email})

    if(!user) { 
      return response.status(400).json({
        message: 'Entered Email not available for any user',
        error: true,
        success: false
      })
    }

    const otp = generateOTP()

    const otPExpireTime = new Date() + 60 * 60 * 1000 // otp expires in 1hr

    const updateOTP = await userModel.findByIdAndUpdate( user._id, { 
      forgot_password_otp: otp,
      forgot_password_expire: otPExpireTime
    })

    await sendEmail({
      sendTo: email,
      subject: 'Forget password OTP from One Cart',
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp
      })
    })

    return response.json({
      message: 'Check Your Email for OTP',
      error: false,
      success: true
    })
  }
  catch(error){
    return response.status(500).json({ 
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// verify forgot password otp
export async function verifyPasswordOTPController(request, response) { 
  try{
    const {email,otp} = request.body

    if(!email || !otp) { 
      return response.status(400).json({
        message: 'Email and OTP required!!!',
        error: true,
        success: false
      })
    }

    const user = await userModel.findOne({email})

    if(!user) {
      return response.status(400).json({
        message: 'Entered Email not available for any user',
        error: true,
        success: false
      })
    }

    // if otp expired
    const currentTime = new Date()
    if(user.forgot_password_expire < currentTime.toISOString()) { 
      return response.status(400).json({
        message: 'OTP Expired!!',
        error: true,
        success: false
      })
    }

    // if otp is not matched with user entered OTP
    if(otp !== user.forgot_password_otp){
      return response.status(400).json({
        message: 'Invalid OTP',
        error: true,
        success: false
      })
    }

    // if otp not expired and otp is matched
    return response.json({ 
      message: 'OTP Verified Successfully',
      error: false,
      success: true
    })
  }
  catch(error) { 
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// reset password controller
export async function resetPasswordController(request, response) { 
  try{
    const { email, newPassword, confirmPassword } = request.body

    if(!email || !newPassword || !confirmPassword) { 
      return response.status(400).json({ 
        message: 'Please provide all the required fields!!',
        error: true,
        success: false
      })
    }

    const user = await userModel.findOne({email})

    if(!user) { 
      return response.status(400).json({
        message: 'Entered Email not available for any user',
        error: true,
        success: false
      })
    }

    if(newPassword !== confirmPassword) { 
      return response.status(400).json({
        message: 'New Password and Confirm Password not matching',
        error: true,
        success: false
      })
    }
    
    
    const passSalt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(newPassword, passSalt)

    const update = await userModel.findOneAndUpdate(user._id, {
      password: hashPassword
    })

    return response.json({
      message: 'Password updated Successfully',
      error: false,
      success: true
    })

  }
  catch(error) { 
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

// managing refresh token
export async function refreshTokenController(request,response) {
  try {
    const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.spllit('')[1]

    if(!refreshToken) { 
      return response.status(401).json({
        message: 'Unauthorised Access',
        error: true,
        success: false
      })
    }

    const checkToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)

    if(!checkToken) { 
      return response.status(401).json({
        message: 'Token Expired',
        error: true,
        success: false
      })
    }
    const userId = checkToken?._id
    const newAccessToken = await generateAccessToken(userId)

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
     }


    response.cookie('accessToken', newAccessToken, cookiesOptions)

    return response.json({ 
      message: 'New Token Generated',
      error: false,
      success: true,
      data: { 
        accessToken: newAccessToken
      }
    })
  }
  catch(error) { 
    return response.status(500).json({
      message: error.message || error, 
      error: true,
      success: false
    })
  }
}