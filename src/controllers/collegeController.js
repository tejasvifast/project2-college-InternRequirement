const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
//######################################################################################################################

let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) { return true }
    if (typeof (value) === "string" && value.trim().length == 0) { return true }
    return false
}
//######################################################################################################################

let createCollege = async (req, res) => {
    try {
        data = req.body
        const { name, fullName, logoLink } = data
        const nameRegex = /^[a-zA-Z ]{2,30}$/

        if (!name) return res.status(400).send({ status: false, Message: "Name is required...." });
        const repeativeCollegeName = await collegeModel.findOne({ name: name })
        if (repeativeCollegeName) return res.status(400).send({ status: true, Message: "This college Name is Already taken" })

        if (keyValid(name)) return res.status(400).send({ status: false, Message: "Name should be valid" })
        if (!name.match(nameRegex)) return res.status(400).send({ status: false, Message: "FIRSTNAME SHOULD ONLY CONATIN ALPHABATS AND LENTH MUST BE IN BETWEEN 2-30" })

        if (!fullName) return res.status(400).send({ status: false, Message: "fullName is required...." });
        if (keyValid(fullName)) return res.status(400).send({ status: false, Message: "fullName should be valid" })

        if (!logoLink) return res.status(400).send({ status: false, Message: "logoLink is required....." });
        if (keyValid(logoLink)) return res.status(400).send({ status: false, Message: "logoLink should be valid" })

        const createdCollege = await collegeModel.create(data)
        return res.status(201).send({ status: true, data: createdCollege })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}

const getCollegeDetails = async function (req, res) {
    try {
        const collegeName = req.query.collegeName

        if (!collegeName) return res.status(400).send({ status: false, Message: "Please Provide College Name" })
        collegeName.trim()
        const collegeDetail = await collegeModel.findOne({ name: collegeName })
        if (!collegeDetail) return res.status(404).send({ status: false, Message: "No College Found" })

        const collegeID = collegeDetail._id

        const internsByCollegeID = await internModel.find({ collegeId: collegeID }).select({ _id: 1, name: 1, email: 1, mobile: 1 })

        const data = {
            name: collegeDetail.name,
            fullName: collegeDetail.fullName,
            logoLink: collegeDetail.logoLink,
            interests: internsByCollegeID
        }

        res.status(200).send({ status: true, data: data })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}
//######################################################################################################################

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails
