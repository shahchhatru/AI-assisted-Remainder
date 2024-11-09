import nodemailer from "nodemailer"
import env from "../../config/env";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
        user: env.email,
        pass: env.password,
    },
});


export default async function sendMail(recipient: string, OTP: number) {

    const mailOptions = {
        from: env.email,
        to: recipient,
        subject: "TASK-MANAGER Verify your account.",
        text: `Your OTP is : ${OTP} \n Enter this otp in the app. \n Go to ${env.endpoint}/v1/auth/verify/${OTP}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Error:', error.message);
        } else {
            console.log('✅ Email sent:', info.response);
        }
    });
}