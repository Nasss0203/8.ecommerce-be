const createError = require("http-errors");
const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");
const transport = require("../database/init.nodemailer");
const { replacePlaceholder } = require("../utils");

const sendEmailLinkVerify = ({
	html,
	toEmail,
	subject = "Xac nhan Email dang ky",
	text = " Xac nhan",
}) => {
	try {
		const mailOptions = {
			from: '"Nass" <anhnamnguyen0203@gmail.com>  ',
			to: toEmail,
			text,
			html,
		};
		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				return console.log(err);
			}

			console.log(`Message sent::`, info.messageId);
		});
	} catch (error) {
		console.log(`Error send Email::`, error);
		return error;
	}
};

const sendEmailToken = async ({ email = null }) => {
	try {
		//1. Get token
		const token = await newOtp({ email });
		//2. Get template
		const template = await getTemplate({
			template_name: "HTML EMAIL TOKEN",
		});

		if (!template) {
			throw new createError(404, "Template not found");
		}

		//3. replace to placeholder with params
		const content = replacePlaceholder(template.template_html, {
			link_verify: `http://localhost:3056/cpg/welcom-back?token=${token}`,
		});

		//4. Send email
		sendEmailLinkVerify({
			html: content,
			toEmail: email,
			subject: "Vui long xac nhan dia chi Email dang ky",
		}).catch((err) => console.error(err));
	} catch (error) {}
};

module.exports = {
	sendEmailToken,
};
