const { roleList } = require("../services/rbac.service");
const rbac = require("./role.middleware");

const createError = require("http-errors");

/**
 *
 * @param {string} action //read, delete or update
 * @param {*} resource // profile, balance
 */

const grantAccess = (action, resource) => {
	return async (req, res, next) => {
		try {
			rbac.setGrants(
				await roleList({
					userId: 9999,
				}),
			);
			const role_name = req.query.role;
			console.log("role_name~", role_name);
			const permission = rbac.can(role_name)[action](resource);
			console.log("permission~", permission.granted);

			if (!permission.granted) {
				throw new createError(
					403,
					"You dont have enough permissions...",
				);
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};

module.exports = {
	grantAccess,
};
