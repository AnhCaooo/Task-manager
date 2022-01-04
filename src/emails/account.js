const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'libraray2021@gmail.com',
        subject: 'Thanks for joining in!', 
        text: `Welcome to our Task Manager app, ${name}. Hope you like our app and enjoy it!`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from: 'libraray2021@gmail.com',
        subject: 'Stop using Task App', 
        text: `Hi, ${name}. Thank you for using our app for a time. I hope to see you back soon.`
    })
}
module.exports = {
    sendWelcomeEmail, 
    sendCancelEmail
}