const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Otp_log";
const COLLECTION_NAME = "Otp_logs";

const otpSchema = new Schema(
	{
		otp_token: { type: String, required: true },
		opt_email: { type: String, required: true },
		otp_status: {
			type: String,
			default: "pending",
			enum: ["pending", "active", "block"],
		},
		expireAt: {
			type: Date,
			default: Date.now,
			expires: 60,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, otpSchema);
