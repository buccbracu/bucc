// TODO: Convert all these to HTML

function welcomeMail(name:String){

return `
Dear ${name},
Welcome to BUCC. We are excited to have you on board.
Remember to join our Discord and Facebook group to stay updated with the latest news and events.
`

}

function verifyMail(name:String,verifyToken:String){

return `
Dear ${name},
Please verify your email by clicking the link below:
${process.env.DOMAIN_URL}/api/users/verify?${verifyToken}`

}

function resetMail(name:String,resetToken:String){
    return `
    Dear ${name},
    Please reset your password by clicking the link below:
    ${process.env.DOMAIN_URL}/api/users/reset?${resetToken}`
}

function sendVerifyToken(name:String,verifyToken:String){
    return `
    Dear ${name},
    Please Copy the Token Below and Paste it in the Verification Page:
    ${verifyToken}`
}

export {welcomeMail,verifyMail,resetMail,sendVerifyToken}