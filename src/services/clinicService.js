import db from "../models/index";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.address ||
                !data.logo ||
                !data.image ||
                !data.descriptionHTMLIntroduce ||
                !data.descriptionMarkdownIntroduce
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.image,
                    logo: data.logo,
                    descriptionHTMLIntroduce: data.descriptionHTMLIntroduce,
                    descriptionMarkdownIntroduce:
                        data.descriptionMarkdownIntroduce,
                    descriptionHTMLStrengths: data.descriptionHTMLStrengths,
                    descriptionMarkdownStrengths:
                        data.descriptionMarkdownStrengths,
                    descriptionHTMLEquipment: data.descriptionHTMLEquipment,
                    descriptionMarkdownEquipment:
                        data.descriptionMarkdownEquipment,
                    descriptionHTMLLocation: data.descriptionHTMLLocation,
                    descriptionMarkdownLocation:
                        data.descriptionMarkdownLocation,
                    descriptionHTMLProcedure: data.descriptionHTMLProcedure,
                    descriptionMarkdownProcedure:
                        data.descriptionMarkdownProcedure,
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

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();

            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, "base64").toString(
                        "binary"
                    );
                    item.logo = new Buffer(item.logo, "base64").toString(
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

let getDetailClinicById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: id,
                    },
                    attributes: [
                        "name",
                        "address",
                        "descriptionHTMLIntroduce",
                        "descriptionMarkdownIntroduce",
                        "descriptionHTMLStrengths",
                        "descriptionMarkdownStrengths",
                        "descriptionHTMLEquipment",
                        "descriptionMarkdownEquipment",
                        "descriptionHTMLLocation",
                        "descriptionMarkdownLocation",
                        "descriptionHTMLProcedure",
                        "descriptionMarkdownProcedure",
                        "image",
                        "logo",
                    ],
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, "base64").toString(
                        "binary"
                    );
                    data.logo = new Buffer(data.logo, "base64").toString(
                        "binary"
                    );
                }

                if (data) {
                    let doctorClinic = [];
                    if (location === "ALL") {
                        doctorClinic = await db.Doctor_infor.findAll({
                            where: { clinicId: id },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorClinic = await db.Doctor_infor.findAll({
                            where: { clinicId: id, provinceId: location },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }
                    data.doctorClinic = doctorClinic;
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

let deleteClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: id },
                raw: false,
            });
            if (!clinic) {
                resolve({
                    errCode: 2,
                    errMessage: "The clinic isn't exist",
                });
            }
            await clinic.destroy();

            resolve({
                errCode: 0,
                errMessage: "Delete success",
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter!",
                });
            }
            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (clinic) {
                clinic.name = data.name;
                clinic.address = data.address;
                clinic.descriptionHTMLIntroduce = data.descriptionHTMLIntroduce;
                clinic.descriptionMarkdownIntroduce =
                    data.descriptionMarkdownIntroduce;
                clinic.descriptionHTMLStrengths = data.descriptionHTMLStrengths;
                clinic.descriptionMarkdownStrengths =
                    data.descriptionMarkdownStrengths;
                clinic.descriptionHTMLEquipment = data.descriptionHTMLEquipment;
                clinic.descriptionMarkdownEquipment =
                    data.descriptionMarkdownEquipment;
                clinic.descriptionHTMLLocation = data.descriptionHTMLLocation;
                clinic.descriptionMarkdownLocation =
                    data.descriptionMarkdownLocation;
                clinic.descriptionHTMLProcedure = data.descriptionHTMLProcedure;
                clinic.descriptionMarkdownProcedure =
                    data.descriptionMarkdownProcedure;
                if (data.image) {
                    clinic.image = data.image;
                }
                if (data.logo) {
                    clinic.logo = data.logo;
                }
                await clinic.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update clinic success!",
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "Clinic not found!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
    updateClinic,
    deleteClinic,
};
