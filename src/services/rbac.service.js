const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
	name = "profile",
	slug = "p00001",
	description = "",
}) => {
	try {
		//1. Check name or slug exists
		//2. New resource
		const resource = await resourceModel.create({
			resource_name: name,
			resource_slug: slug,
			resource_description: description,
		});

		return resource;
	} catch (error) {
		return error;
	}
};

const resourceList = async ({
	userId = 0, //admin
	limit = 30,
	offset = 0,
	search = "",
}) => {
	try {
		//1. Check admin ? middleware function
		//2. Get list of resource
		const resources = await resourceModel.aggregate([
			{
				$project: {
					_id: 0,
					name: "$resource_name",
					slug: "$resource_slug",
					description: "$resource_description",
					resourceId: "$_id",
					createdAt: 1,
				},
			},
		]);

		return resources;
	} catch (error) {
		return error;
	}
};

const createRole = async ({
	name = "shop",
	slug = "s00001",
	description = "Extend from shop or user",
	grants = [],
}) => {
	try {
		//1. Check role exists

		//2. New role
		const role = await roleModel.create({
			role_name: name,
			role_slug: slug,
			role_description: description,
			role_grants: grants,
		});

		return role;
	} catch (error) {
		throw error;
	}
};

const roleList = async ({
	userId = 0, //admin
	limit = 30,
	offset = 0,
	search = "",
}) => {
	try {
		//1. userId
		//2. List roles

		const roles = await roleModel.aggregate([
			{
				$unwind: "$role_grants",
			},
			{
				$lookup: {
					from: "Resources",
					localField: "role_grants.resource",
					foreignField: "_id",
					as: "resource",
				},
			},
			{
				$unwind: "$resource",
			},
			{
				$project: {
					role: "$role_name",
					resource: "$resource.resource_name",
					action: "$role_grants.actions",
					attributes: "$role_grants.attributes",
				},
			},
			{
				$unwind: "$action",
			},
			{
				$project: {
					_id: 0,
					role: 1,
					resource: 1,
					action: "$action",
					attributes: 1,
				},
			},
		]);

		return roles;
	} catch (error) {}
};

module.exports = { createResource, resourceList, createRole, roleList };
