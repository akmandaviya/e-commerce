import sendEmail from '../config/sendEmail.js'
import userModel from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import generateAccessToken from '../utils/generateAccessToken.js'

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