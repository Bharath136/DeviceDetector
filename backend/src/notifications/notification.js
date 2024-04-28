const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

function sendDeviceLocationUpdateNotification(email, name, deviceName, address) {
    const mailOptions = {
        from: process.env.EMAIL, // replace with your email
        to: email,
        subject: 'Device Location Update Notification (Sample Test)',
        text: `Dear ${name},

We hope this message finds you well.

We wanted to inform you that our system has detected an update in the location of your registered device, ${deviceName}. The current location has been identified as:

${address}

This location update is part of our ongoing efforts to enhance the security and tracking features of our devices. If you recognize this location update, you can disregard this message.

Thank you for choosing our service.

Best regards,
[Your Company Name]
[Your Contact Information]`,
    };

    // Send the email
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports = {
    sendDeviceLocationUpdateNotification
};
