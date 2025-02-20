import jwt from 'jsonwebtoken'

const auth = async (request, response, next) => { 
  try{    
    const token = request.cookies.accessToken || request?.header?.authorization?.split('')[1]  // ['bearer' ,'token']

    if(!token) { 
      return response.status(401).json({
        message: 'Provide Token'
      })
    }

    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    
    if(!decode) { 
      return response.status(401).json({
        message: 'User Unauthorised !!'
      })
    }

    request.userId = decode.id

    next()
  }
  catch(error){
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export default auth