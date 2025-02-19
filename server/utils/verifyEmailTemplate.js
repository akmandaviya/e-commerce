const verifyEmailTemplate = ({name,url}) => { 
    return `
    <p> Dear ${name}
    <p> Thanks for registering to One Cart/<p>
    <a href=${url} style='background: #05a95c; color: #ffff; margin-top: 10px'> 
    Click to Verify Email 
    </a>
    `
}

export default verifyEmailTemplate