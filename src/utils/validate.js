/**
 * Hàm tiện ích để validation form inputs
 */

/**
 * Kiểm tra định dạng email hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - true nếu email hợp lệ
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra password không rỗng và có độ dài tối thiểu
 * @param {string} password - Password cần kiểm tra
 * @param {number} minLength - Độ dài tối thiểu (mặc định 6)
 * @returns {boolean} - true nếu password hợp lệ
 */
export const validatePassword = (password, minLength = 6) => {
  return password && password.trim().length >= minLength;
};

/**
 * Kiểm tra field không rỗng
 * @param {string} value - Giá trị cần kiểm tra
 * @returns {boolean} - true nếu không rỗng
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};
