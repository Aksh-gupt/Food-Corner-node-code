const sgmail = require('@sendgrid/mail')

 
// sgmail.setApiKey(process.env.SENDGRID_API_KEY);
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name)=>{
    sgmail.send({ 
        to: email,
        from:'akshat4guptajan@gmail.com',
        subject : `${name}, let's get you started with Food Corner`,
        text:`Welcome to Food Corner ${name} , Your membership with Food Corner is confirmed. Thanks for signing up!`
    }) 
}

const sendOrderConfirm = (email,name) => {
    sgmail.send({
        to: email,
        from:'akshat4guptajan@gmail.com',
        subject : 'Order confirm',
        text:`Hey, ${name} 
        We received your order. We’ll send your purchase across as soon as possible.
        Thanks,
        Food Corner`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendOrderConfirm
}
