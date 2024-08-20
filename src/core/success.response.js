const StatusCode = {
	OK: 200,
	CREATED: 201,
};

const ReasonStatusCode = {
	OK: "Success",
	CREATED: "Created!",
};

/**
    Constructor:
        - message: Tham số này chứa thông điệp thành công của phản hồi. Nếu không được cung cấp (!message), nó sẽ sử dụng reasonStatusCode làm giá trị mặc định.
        - statusCode: Mã lỗi HTTP của phản hồi thành công. Mặc định là 200 (OK) nếu không được cung cấp.
        - reasonStatusCode: Thông điệp mặc định của phản hồi thành công, được sử dụng khi không có message.
        - metadata: Dữ liệu bổ sung có thể đi kèm với phản hồi. Mặc định là một đối tượng rỗng {}.
    Phương thức send:
        - res: Đối tượng response của Express để gửi phản hồi về cho client.
        - headers: Các headers tùy chọn có thể đi kèm với phản hồi (hiện tại không được sử dụng trong đoạn mã này).
        - Phương thức này thiết lập status code của response thành this.status (mã lỗi của phản hồi), sau đó gửi phản hồi dưới dạng JSON với các thuộc tính của đối tượng SuccessResponse, bao gồm message, status, và metadata.
 */
class SuccessResponse {
	constructor({
		message,
		statusCode = StatusCode.OK,
		reasonStatusCode = ReasonStatusCode.OK,
		metadata = {},
	}) {
		this.message = !message ? reasonStatusCode : message; // Thiết lập thông điệp thành công, mặc định là "Success" nếu không có message
		this.status = statusCode; // Thiết lập mã lỗi, mặc định là 200 (OK)
		this.metadata = metadata; // Thiết lập dữ liệu bổ sung, mặc định là một đối tượng rỗng {}
	}
	send(res, headers = {}) {
		return res.status(this.status).json(this); // Gửi phản hồi thành công dưới dạng JSON với mã lỗi và dữ liệu bổ sung
	}
}

class OK extends SuccessResponse {
	constructor({ message, metadata }) {
		super({ message, metadata });
	}
}

class CREATED extends SuccessResponse {
	constructor({
		options = {},
		message,
		statusCode = StatusCode.CREATED,
		reasonStatusCode = ReasonStatusCode.CREATED,
		metadata,
	}) {
		super({ message, metadata });
		this.optiosn = options;
	}
}

module.exports = {
	OK,
	CREATED,
	SuccessResponse,
};
