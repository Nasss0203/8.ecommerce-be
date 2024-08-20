const { SuccessResponse } = require("../core/success.response");
const {
	createResource,
	createRole,
	resourceList,
	roleList,
} = require("../services/rbac.service");

/**
 * @description Create a new role
 * @param {string} req
 * @param {*} res
 * @param {*} next
 */
const newRole = async (req, res, next) => {
	new SuccessResponse({
		message: "Create new role",
		metadata: await createRole(req.body),
	}).send(res);
};

const newResource = async (req, res, next) => {
	new SuccessResponse({
		message: "Create new resource",
		metadata: await createResource(req.body),
	}).send(res);
};

const listRole = async (req, res, next) => {
	new SuccessResponse({
		message: "Get list role",
		metadata: await roleList(req.query),
	}).send(res);
};

const listResource = async (req, res, next) => {
	new SuccessResponse({
		message: "Get list resource",
		metadata: await resourceList(req.query),
	}).send(res);
};
module.exports = {
	newRole,
	newResource,
	listRole,
	listResource,
};
