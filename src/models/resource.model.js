const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "Resources";

const resourceSchema = new Schema(
	{
		resource_name: { type: String, required: true }, // profile
		resource_slug: { type: String, required: true }, // 000001
		resource_description: { type: String, default: "" },
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, resourceSchema);
