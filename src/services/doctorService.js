//admin - dat lich

import db from "../models/index";
import _ from "lodash";
require("dotenv").config;

import emailService from "../services/emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: true,
                nest: true,
            });

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
                data: data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let checkRequiedFields = (inputData) => {
    let arrFields = [
        "doctorId",
        "contentHTML",
        "contentMarkdown",
        "action",
        "selectedPrice",
        "selectedPayment",
        "selectedProvince",
        "nameClinic",
        "addressClinic",
        "note",
        "specialtyId",
    ];
    let isValid = true;
    let element = "";
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid,
        element,
    };
};

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiedFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters: ${checkObj.element} !`,
                });
            } else {
                // upsert to markdown
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {
                            doctorId: inputData.doctorId,
                        },
                        raw: false,
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown =
                            inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }
                }

                // upsert to doctor_infor
                let doctor_infor = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });
                if (doctor_infor) {
                    // update
                    doctor_infor.doctorId = inputData.doctorId;
                    doctor_infor.priceId = inputData.selectedPrice;
                    doctor_infor.provinceId = inputData.selectedProvince;
                    doctor_infor.paymentId = inputData.selectedPayment;
                    doctor_infor.nameClinic = inputData.nameClinic;
                    doctor_infor.addressClinic = inputData.addressClinic;
                    doctor_infor.note = inputData.note;
                    doctor_infor.specialtyId = inputData.specialtyId;
                    doctor_infor.clinicId = inputData.clinicId;
                    await doctor_infor.save();
                } else {
                    // create
                    await db.Doctor_infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save details infor doctor success!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "description",
                                "contentHTML",
                                "contentMarkdown",
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = new Buffer(data.image, "base64").toString(
                        "binary"
                    );
                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                // get all existing data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatDate },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                });

                // Compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                // Create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "timeTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.User,
                            as: "doctorData",
                            attributes: ["firstName", "lastName"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: doctorId,
                    },
                    attributes: {
                        exclude: ["id", "doctorId"],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "priceData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "provinceData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "paymentData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "description",
                                "contentHTML",
                                "contentMarkdown",
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, "base64").toString(
                        "binary"
                    );
                }
                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: "S2",
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: [
                                "firstName",
                                "email",
                                "address",
                                "gender",
                            ],
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "genderData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "timeTypeDataPatient",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.patientId ||
                !data.timeType
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                // Update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: "S2",
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = "S3";
                    await appointment.save();
                }

                // Send email remedy
                await emailService.sendAttachment(data);
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

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getDetailDoctorById,
    // getMarkdownById,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
};
