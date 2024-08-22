const templateModel = require("../models/template.model");
const { htmlEmailToken } = require("../utils/template.html");

const newTemplate = async ({ template_name, template_html, template_id }) => {
	//1. Check if template exists

	//2. Create a new temmplate
	const newTemplate = await templateModel.create({
		template_id,
		template_name, //unique name
		template_html: htmlEmailToken(),
	});

	return newTemplate;
};

const getTemplate = async ({ template_name }) => {
	const template = await templateModel.findOne({
		template_name,
	});
	return template;
};

module.exports = {
	newTemplate,
	getTemplate,
};
