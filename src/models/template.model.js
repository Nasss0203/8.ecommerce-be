const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Template";
const COLLECTION_NAME = "Templates";

const templateSchema = new Schema(
	{
		template_id: { type: Number, required: true },
		template_name: { type: String, required: true },
		template_status: { type: String, default: "active" },
		template_html: { type: String, default: true },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, templateSchema);
