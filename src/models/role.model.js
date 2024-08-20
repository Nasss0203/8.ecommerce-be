const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

const roleSchema = new Schema(
	{
		role_name: {
			type: String,
			default: "user",
			enum: ["user", "admin", "shop"],
		},
		role_slug: {
			type: String,
			required: true,
		},
		role_status: {
			type: String,
			default: "active",
			enum: ["active", "block", "pending"],
		},
		role_description: { type: String, default: "" },
		role_grants: [
			{
				resource: {
					type: Schema.Types.ObjectId,
					ref: "Resource",
					required: true,
				},
				actions: [{ type: String, required: true }],
				attributes: { type: String, default: "*" },
			},
		],
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, roleSchema);
