import specialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(2002).json({
            errCode: -1,
            errMessage: "Error from server...",
        });
    }
};

let getAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialty();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(2002).json({
            errCode: -1,
            errMessage: "Error from server...",
        });
    }
};

let getDetailSpecialtyById = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialtyById(
            req.query.id,
            req.query.location
        );
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(2002).json({
            errCode: -1,
            errMessage: "Error from server...",
        });
    }
};

let deleteSpecialty = async (req, res) => {
    let specialtyId = req.body.id;
    if (!specialtyId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!",
        });
    }
    let message = await specialtyService.deleteSpecialty(specialtyId);
    return res.status(200).json(message);
};

let editSpecialty = async (req, res) => {
    let data = req.body;
    let message = await specialtyService.updateSpecialty(data);
    return res.status(200).json(message);
};

// let getSpecialtyLimitTen = async (req, res) => {
//     let limit = req.query.limit;
//     if (!limit) limit = 10;
//     try {
//         let response = await specialtyService.getSpecialtyLimitTen(+limit);
//         return res.status(200).json(response);
//     } catch (error) {
//         console.log(error);
//         return res.status(200).json({
//             errCode: -1,
//             errMessage: "Error from server...",
//         });
//     }
// };

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialty,
    editSpecialty,
    // getSpecialtyLimitTen,
};
