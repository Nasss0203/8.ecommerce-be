const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInforData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
};

/**
 * Chuyển đổi một mảng các phần tử thành một đối tượng
 * với các phần tử trong mảng làm khóa và giá trị là 1.
 *
 * @param {Array} select - Mảng các phần tử để chuyển đổi.
 * @return {Object} - Đối tượng với các phần tử trong mảng làm khóa và giá trị là 1.
 */
const getSelectData = (select = []) => {
	// Sử dụng map để tạo ra mảng các cặp khóa-giá trị [phần tử, 1]
	// Sau đó chuyển mảng này thành đối tượng bằng Object.fromEntries
	return Object.fromEntries(select.map((el) => [el, 1]));
};

/**
 * Chuyển đổi một mảng các phần tử thành một đối tượng
 * với các phần tử trong mảng làm khóa và giá trị là 0.
 *
 * @param {Array} select - Mảng các phần tử để chuyển đổi.
 * @return {Object} - Đối tượng với các phần tử trong mảng làm khóa và giá trị là 0.
 */
const unGetSelectData = (select = []) => {
	// Sử dụng map để tạo ra mảng các cặp khóa-giá trị [phần tử, 0]
	// Sau đó chuyển mảng này thành đối tượng bằng Object.fromEntries
	return Object.fromEntries(select.map((el) => [el, 0]));
};

/**
 * Hàm này loại bỏ các thuộc tính có giá trị null hoặc undefined khỏi một đối tượng.
 *
 * @param {Object} obj - Đối tượng cần loại bỏ thuộc tính.
 * @returns {Object} - Đối tượng đã được làm sạch, không có thuộc tính null hoặc undefined.
 */
const removeUndefine = (obj) => {
	// Lặp qua tất cả các khóa của đối tượng
	Object.keys(obj).forEach((k) => {
		// Nếu giá trị là null hoặc undefined, xóa khóa đó khỏi đối tượng
		if (obj[k] == null) {
			// `== null` kiểm tra cả null và undefined
			delete obj[k];
		}
	});
	// Trả về đối tượng đã được làm sạch
	return obj;
};

/**
 * Hàm này làm phẳng một đối tượng lồng nhau. Các thuộc tính lồng nhau được chuyển thành một đối tượng mức đơn
 * với các khóa đại diện cho cấu trúc lồng nhau sử dụng ký hiệu dấu chấm.
 *
 * @param {Object} obj - Đối tượng cần làm phẳng.
 * @returns {Object} - Đối tượng đã được làm phẳng.
 */
const updateNestedObjectParser = (obj) => {
	// Tạo một đối tượng rỗng để chứa các thuộc tính đã được làm phẳng
	const final = {};
	// Lặp qua tất cả các khóa của đối tượng
	Object.keys(obj).forEach((k) => {
		// Nếu giá trị là một đối tượng và không phải là một mảng, đệ quy làm phẳng nó
		if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
			const response = updateNestedObjectParser(obj[k]);
			// Với mỗi khóa trong đối tượng con đã được làm phẳng, tạo một khóa mới trong đối tượng cuối cùng
			// với khóa hiện tại làm tiền tố theo sau là dấu chấm
			Object.keys(response).forEach((a) => {
				final[`${k}.${a}`] = response[a];
			});
		} else {
			// Nếu giá trị không phải là một đối tượng, chỉ cần sao chép nó vào đối tượng cuối cùng
			final[k] = obj[k];
		}
	});

	// Trả về đối tượng đã được làm phẳng
	return final;
};

const locks = {}; // Đối tượng lưu trữ các khóa
// Hàm lấy khóa
const acquireLock = (productId) => {
	return new Promise((resolve, reject) => {
		const key = `lock_v203_${productId}`;
		const retryTimes = 10;
		const expireTime = 3000; // Không sử dụng trong bộ nhớ chia sẻ đơn giản

		const tryAcquire = (attempt) => {
			if (attempt >= retryTimes) {
				return resolve(false); // Không thể lấy khóa sau nhiều lần thử
			}

			if (!locks[key]) {
				locks[key] = true; // Đặt khóa
				return resolve(true);
			}

			setTimeout(() => tryAcquire(attempt + 1), 50); // Thử lại sau 50ms
		};

		tryAcquire(0);
	});
};

// Hàm giải phóng khóa
const releaseLock = (productId) => {
	const key = `lock_v203_${productId}`;
	delete locks[key]; // Xóa khóa
};

module.exports = {
	getInforData,
	getSelectData,
	unGetSelectData,
	removeUndefine,
	updateNestedObjectParser,
	convertToObjectIdMongodb,
	acquireLock,
	releaseLock,
};
