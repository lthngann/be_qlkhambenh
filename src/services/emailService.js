"use strict";
import nodemailer from "nodemailer";
require("dotenv").config();

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking Care" <lthngan10@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này thì đã đặt lịch khám bệnh online trên website của Lê Thủy Ngân</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để hoàn thành xác nhận đặt lịch khám bệnh</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Xin chân thành cảm ơn!</div>
        `;
    }
    if (dataSend.language === "en") {
        result = `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>If you received this email, you have already booked an online medical appointment on the hieult website</p>
        <p>Information to schedule an appointment: </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is correct, please click on the link below to complete the booking confirmation</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Sincerely thank!</div>
        `;
    }
    return result;
};

let getBodyHTMLEmailRemerdy = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này thì đã đặt lịch khám bệnh online trên website hieult thành công</p>
        <p>Thông tin hóa đơn được gửi trong file đính kèm</p>

        <div>Xin chân thành cảm ơn!</div>
        `;
    }
    if (dataSend.language === "en") {
        result = `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>If you received this email, you have already booked an online medical appointment on the hieult website</p>
        <p>Information to schedule an appointment: </p>

        <div>Sincerely thank!</div>
        `;
    }
    return result;
};

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Bác sĩ: Trần Thế Phương" <infor.letrunghiheu@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                text: "Hello world?", // plain text body
                html: getBodyHTMLEmailRemerdy(dataSend), // html body
                attachments: [
                    {
                        fileName: `remedy-${
                            dataSend.patiendId
                        }-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: "base64",
                    },
                ],
            });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    sendSimpleEmail,
    sendAttachment,
};
