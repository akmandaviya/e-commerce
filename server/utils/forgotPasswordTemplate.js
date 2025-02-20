const forgotPasswordTemplate = ({ name, otp })=>{
  return `
<div>
  <p>Dear, ${name}</p>
  <p>You're requested a password reset. Please use following OTP code to reset your password.</p>
  <div style="background:#000080; color:#FFFF; font-size:20px;padding:15px;text-align:center;font-weight:800;">
      ${otp}
  </div>
  <p>This otp is valid for 10 mins only. Enter this otp in the One Cart website to proceed with resetting your password.</p>
  <br/>
  </br>
  <p>Thanks</p>
  <p>One Cart</p>
</div>
  `
}

export default forgotPasswordTemplate