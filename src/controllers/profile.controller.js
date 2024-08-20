const { SuccessResponse } = require("../core/success.response");

const profiles = [
	{
		user_id: 1,
		user_name: "CR7",
		user_avt: "image.com/user_id1",
	},
	{
		user_id: 2,
		user_name: "Nass",
		user_avt: "image.com/user_id2",
	},
	{
		user_id: 3,
		user_name: "MS10",
		user_avt: "image.com/user_id3",
	},
];

class ProfileController {
	//admin
	static profiles = async (req, res, next) => {
		new SuccessResponse({
			message: "View All Profile",
			metadata: profiles,
		}).send(res);
	};

	//shop

	static profile = async (req, res, next) => {
		new SuccessResponse({
			message: "View One Profile",
			metadata: {
				user_id: 2,
				user_name: "Nass",
				user_avt: "image.com/user_id2",
			},
		}).send(res);
	};
}

module.exports = ProfileController;
