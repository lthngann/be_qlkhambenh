import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                // User already exists
                let user = await db.User.findOne({
                    attributes: [
                        "id",
                        "email",
                        "roleId",
                        "password",
                        "firstName",
                        "lastName",
                    ],
                    where: { email: email },
                });
                if (user) {
                    // compare password
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "oke";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage =
                    "Your email isn't exist in your system. Please try again.";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Check email is exists
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Email already exists. Please try again!",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(
                    data.password
                );
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                });
                resolve({
                    errCode: 0,
                    errMessage: "ok",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false,
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "The user isn't exist",
                });
            }

            if (user) {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: {
                        doctorId: userId,
                    },
                    raw: false,
                });

                if (doctorMarkdown) {
                    await doctorMarkdown.destroy();
                }
                let doctorInfor = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: userId,
                    },
                    raw: false,
                });
                if (doctorInfor) {
                    await doctorInfor.destroy();
                }
            }
            await user.destroy();

            resolve({
                errCode: 0,
                errMessage: "Delete success",
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.positionId || !data.roleId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter!",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update user success!",
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User not found!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCodeServer = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: {
                        type: typeInput,
                    },
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,

    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeServer: getAllCodeServer,
};
