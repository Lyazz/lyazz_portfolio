"use strict";

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/api/contact", async (req, res) => {
	const name = String(req.body.name || "").trim();
	const subject = String(req.body.subject || req.body._subject || "").trim();
	const message = String(req.body.message || "").trim();

	if (!name || !subject || !message) {
		return res.status(400).json({ ok: false, error: "Missing required fields." });
	}

	const smtpHost = process.env.SMTP_HOST;
	const smtpUser = process.env.SMTP_USER;
	const smtpPass = process.env.SMTP_PASS;

	if (!smtpHost || !smtpUser || !smtpPass) {
		return res.status(500).json({ ok: false, error: "Email service not configured." });
	}

	const smtpPort = Number(process.env.SMTP_PORT || 587);
	const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
	const toAddress = process.env.SMTP_TO || smtpUser;
	const fromAddress = process.env.SMTP_FROM || `Portfolio Contact <${smtpUser}>`;
	const replyTo = process.env.SMTP_REPLY_TO;

	const safeSubject = subject.replace(/[\r\n]+/g, " ").slice(0, 200);
	const safeName = name.replace(/[\r\n]+/g, " ").slice(0, 200);
	const safeMessage = message.replace(/\r\n/g, "\n");

	try {
		const transporter = nodemailer.createTransport({
			host: smtpHost,
			port: smtpPort,
			secure: smtpSecure,
			auth: {
				user: smtpUser,
				pass: smtpPass
			}
		});

		await transporter.sendMail({
			to: toAddress,
			from: fromAddress,
			replyTo: replyTo || undefined,
			subject: `Portfolio: ${safeSubject}`,
			text: `Name: ${safeName}\nSubject: ${safeSubject}\n\n${safeMessage}\n`
		});

		return res.json({ ok: true });
	} catch (error) {
		console.error("Contact email failed:", error);
		return res.status(500).json({ ok: false, error: "Failed to send email." });
	}
});

app.listen(port, () => {
	console.log(`Portfolio server running at http://localhost:${port}`);
});
