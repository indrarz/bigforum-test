const {
  response,
  hashPassword,
  comparePassword,
  isEmpty,
} = require("../middleware/bcrypt");
const { NotFoundError, DuplicatedDataError } = require("../error");
const User = require("../model/User");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password) {
  const minLength = /.{8,}/;
  const hasUppercase = /[A-Z]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    minLength.test(password) &&
    hasUppercase.test(password) &&
    hasSpecialChar.test(password)
  );
}

exports.getAll = async (req, res) => {
  try {
    let users = await User.findAll();

    if (isEmpty(users)) {
      throw new NotFoundError("Users Not Found!");
    }

    // prevent password to be shown in response
    users = users.map((user) => {
      user.password = undefined;
      return JSON.parse(JSON.stringify(user));
    });

    return response(res, {
      code: 200,
      success: true,
      message: "Successfully retrieved users data!",
      content: users,
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return response(res, {
        code: 404,
        success: false,
        message: error.message,
      });
    }

    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong!",
      content: error,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findByPk(id);

    if (!user) throw new NotFoundError(`User not found!`);

    // prevent password to be shown in response
    user.password = undefined;
    user = JSON.parse(JSON.stringify(user));

    return response(res, {
      code: 200,
      success: true,
      message: `Successfully retrieved user data!`,
      content: user,
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return response(res, {
        code: 404,
        success: false,
        message: error.message,
      });
    }

    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong!",
      content: error,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return response(res, {
        code: 400,
        success: false,
        message: "All fields are required!",
      });
    }

    if (email && !isValidEmail(email)) {
      return response(res, {
        code: 400,
        success: false,
        message: "Please enter a valid email address!",
      });
    }

    // Validate password
    if (!isStrongPassword(password)) {
      return response(res, {
        code: 400,
        success: false,
        message:
          "Password must be at least 8 characters long, contain capital letters, and special characters!",
      });
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      throw new DuplicatedDataError("User already exists!");
    }

    const hashedPassword = await hashPassword(password);

    let createdUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      userUpdate: email,
    });

    // prevent password to be showed in response
    createdUser.password = undefined;
    createdUser = JSON.parse(JSON.stringify(createdUser));

    return response(res, {
      code: 200,
      success: true,
      message: "Successfully registered!",
      content: createdUser,
    });
  } catch (error) {
    if (error.name === "DuplicatedDataError") {
      return response(res, {
        code: 409,
        success: false,
        message: error.message,
      });
    }

    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong!",
      content: error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { first_name, last_name, email, currentPassword, newPassword } =
      req.body;
    const { id } = req.params;
    const userUpdate = req.user.email;

    const userExists = await User.findByPk(id);
    if (!userExists) {
      throw new NotFoundError(`User not found!`);
    }

    if (
      !first_name ||
      !last_name ||
      !email ||
      !currentPassword ||
      !newPassword
    ) {
      return response(res, {
        code: 400,
        success: false,
        message: "All fields are required!",
      });
    }

    if (email && !isValidEmail(email)) {
      return response(res, {
        code: 400,
        success: false,
        message: "Please enter a valid email address!",
      });
    }

    // Validate new password
    if (!isStrongPassword(newPassword)) {
      return response(res, {
        code: 400,
        success: false,
        message:
          "New password must be at least 8 characters long, contain capital letters, and special characters!",
      });
    }

    // Verify current password
    const passwordMatch = await comparePassword(
      currentPassword,
      userExists.password
    );
    if (!passwordMatch) {
      return response(res, {
        code: 400,
        success: false,
        message: "Current password is incorrect!",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await User.update(
      { first_name, last_name, email, password: hashedPassword, userUpdate },
      { where: { id } }
    );

    let updateUser = await User.findByPk(id);
    updateUser.password = undefined;
    updateUser = JSON.parse(JSON.stringify(updateUser));

    return response(res, {
      code: 200,
      success: true,
      message: "Successfully updated!",
      content: updateUser,
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return response(res, {
        code: 404,
        success: false,
        message: error.message,
      });
    }

    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong!",
      content: error,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.user.email;

    const user = await User.findByPk(id);

    if (!user) throw new NotFoundError("User not found!");

    if (user.email === email) {
      return response(res, {
        code: 400,
        success: false,
        message: "You cannot delete your own account!",
      });
    }

    user.status = false;
    await user.save();

    return response(res, {
      code: 200,
      success: true,
      message: "Successfully deactivated user!",
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return response(res, {
        code: 404,
        success: false,
        message: error.message,
      });
    }

    return response(res, {
      code: 500,
      success: false,
      message: error.message || "Something went wrong!",
      content: error,
    });
  }
};
