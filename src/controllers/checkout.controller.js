const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
	checkoutReview = async (req, res, next) => {
		new SuccessResponse({
			message: "Create new checkoutReview success",
			metadata: await CheckoutService.checkoutReview(req.body),
		}).send(res);
	};

	findCheckoutById = async (req, res, next) => {
		new SuccessResponse({
			message: "Find Checkout By Id success",
			metadata: await CheckoutService.findCheckoutById({
				checkoutId: req.params.checkoutId,
			}),
		}).send(res);
	};
}

module.exports = new CheckoutController();
