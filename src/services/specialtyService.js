import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.nameVi ||
                !data.nameEn ||
                !data.image ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                await db.Specialty.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
                    image: data.image,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });

                resolve({
                    errCode: 0,
                    errMessage: "Oke",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();

            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, "base64").toString(
                        "binary"
                    );
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: "Oke",
                data: data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: id,
                    },
                    attributes: [
                        "nameVi",
                        "nameEn",
                        "descriptionHTML",
                        "descriptionMarkdown",
                    ],
                });

                if (data) {
                    let doctorSpecialty = [];
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_infor.findAll({
                            where: { specialtyId: id },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_infor.findAll({
                            where: { specialtyId: id, provinceId: location },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else data = {};
                resolve({
                    errCode: 0,
                    errMessage: "Oke",
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteSpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: { id: specialtyId },
                raw: false,
            });
            if (!specialty) {
                resolve({
                    errCode: 2,
                    errMessage: "The specialty isn't exist",
                });
            }
            await specialty.destroy();

            resolve({
                errCode: 0,
                errMessage: "Delete success",
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter!",
                });
            }
            let specialty = await db.Specialty.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (specialty) {
                specialty.nameVi = data.nameVi;
                specialty.nameEn = data.nameEn;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                specialty.descriptionHTML = data.descriptionHTML;
                if (data.image) {
                    specialty.image = data.image;
                }
                await specialty.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update specialty success!",
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "Specialty not found!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// let getSpecialtyLimitTen = (limit) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let specialties = await db.Specialty.findAll({
//                 limit: limit,
//                 order: [["createdAt", "DESC"]],
//                 attributes: ["nameVi", "nameEn"],
//                 raw: true,
//                 nest: true,
//             });
//             resolve({
//                 errCode: 0,
//                 data: specialties,
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialty,
    updateSpecialty,
    // getSpecialtyLimitTen,
};
