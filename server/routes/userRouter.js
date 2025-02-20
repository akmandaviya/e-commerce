import { Router } from 'express'
import auth from '../middleware/auth.js'
import registerUserController, { loginController, logoutController, verifyUserController } from '../controllers/userController.js'

const userRouter = Router()

userRouter.post('/register-user', registerUserController)
userRouter.post('/verify-email', verifyUserController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController)

export default userRouter