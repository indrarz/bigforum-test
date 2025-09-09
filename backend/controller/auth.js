require("dotenv").config();
const User = require("../model/User");
const { response, comparePassword } = require("../middleware/bcrypt");
const { WrongPasswordError, NotFoundError } = require("../error");
const jwt = require("jsonwebtoken");

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return response(res, {
        code: 400,
        success: false,
        message: "All fields are required!",
      });
    }

    if (!isValidEmail(email)) {
      return response(res, {
        code: 400,
        success: false,
        message: "Email format is invalid!",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError("Your email or password is incorrect!");
    }

    if (!user.status) {
      return response(res, {
        code: 400,
        success: false,
        message:
          "Your account is blocked and inactive. Please contact administrator.",
      });
    }

    // compare user-inputed password with database password
    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      throw new WrongPasswordError("Your email or password is incorrect!");
    }

    // create new jwt token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: 'user',
      },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "1h" },
    );

    // store the token in user browser cookie
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    return response(res, {
      code: 200,
      success: true,
      message: "Login successfully!",
      content: { token },
    });
  } catch (error) {
    if (error.name === "NotFoundError" || error.name === "WrongPasswordError") {
      return response(res, {
        code: 400,
        success: false,
        message: error.message,
      });
    }

    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong.",
      content: error,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: true,
    });

    return response(res, {
      code: 200,
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};
