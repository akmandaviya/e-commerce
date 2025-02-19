import { Router } from 'express'
import registerUserController, { verifyUserController } from '../controllers/userController.js'

const userRouter = Router()

userRouter.post('/register-user', registerUserController)
userRouter.post('/verify-email', verifyUserController)

export default userRouter