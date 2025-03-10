import { Router } from 'express'
import auth from '../middleware/auth.js'
import registerUserController, { loginController, 
                                 logoutController, 
                                 verifyUserController, 
                                 uploadAvatarController, 
                                 updateUserDataController,
                                 forgotPasswordController,
                                 verifyPasswordOTPController,
                                 resetPasswordController,
                                 refreshTokenController} from '../controllers/userController.js'
import upload from '../middleware/multer.js'

const userRouter = Router()

userRouter.post('/register-user', registerUserController)
userRouter.post('/verify-email', verifyUserController)
userRouter.post('/login', loginController)
userRouter.get('/logout', auth, logoutController) // only logged in user can access this appi ,using auth
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatarController)
userRouter.put('/update-profile-details', auth, updateUserDataController)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyPasswordOTPController)
userRouter.put('/reset-password', resetPasswordController)
userRouter.post('/refresh-token', refreshTokenController)

export default userRouter