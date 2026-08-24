// Nodemailer does not ship TypeScript declarations in this project.
// @ts-expect-error: Nodemailer is untyped.
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port : 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD?.replace(/\s/g, "")
    }
});

export default transporter

