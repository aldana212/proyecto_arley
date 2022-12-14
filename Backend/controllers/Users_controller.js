const servi_User = require('../services/users_sevices.js');
const services = new servi_User();
const auth_servi = require('../services/authService.js')
const auth = new auth_servi();
const Joi = require('@hapi/joi');


const validateRegister = Joi.object({
    image: Joi.string(),
    cedula: Joi.number().required(),
    name: Joi.string().min(3).max(255).required(),
    mail: Joi.string().min(3).max(255).lowercase().required().email(),
    contraseña: Joi.string().min(3).max(255).required(),
})

const validateLogin = Joi.object({
    cedula: Joi.number().required(),
    contraseña: Joi.string().min(3).max(255).required(),
})

const validateCreate = Joi.object({
    cedula: Joi.number().required(),
    name: Joi.string().min(3).max(255).required(),
    mail: Joi.string().min(3).max(255).lowercase().required().email(),
    contraseña: Joi.string().min(3).max(255).required(),
})

class UserController {

    async GetUsers(req, res) {
        try {
            const show = services.Users_Admin()
            show.then(responde => {
                res.status(201).json({ status: "OK", data: responde });
            }).catch(error => {
                res.status(500).json({ status: "FAILDED", data: error });
            })
        } catch (error) {
            console.log("error.." + error)
        }
    }
    // async GetUserId(req, res) {
    //     try {
    //         const cedula = req.params.cedula
    //         console.log(cedula);
    //         const show = services.Users_AdminId(cedula)
    //         show.then(responde => {
    //             console.log(responde);
    //             res.status(201).json({ status: 201 , data: responde });
    //         }).catch(error => {
    //             console.log("error111");
    //             res.status(500).json({ status: "FAILDED", data: error });
    //         })
    //     } catch (error) {
    //         console.log("error.." + error)
    //     }
    // }

    async UserCardTrain(req, res){
        try {
        const id = req.params.cedula;
        console.log(id);
        const ShowCard = services.UserCardTrain(id)
        ShowCard.then(responde =>{
           res.status(201).json({ status:201, responde})
        }).catch(err =>{
           res.status(501).json({ status:501, err})
        })  
        } catch (error) {
            console.log(error);
        }
    }
    
    async UserLogin(req, res) {
        const { error } = validateLogin.validate(req.body)
        if (error) {
            return res.status(400).json(
                { error: error.details[0].message }
            )
        }
        try {
            const data = req.body
            const validar = auth.Users_Login(data)
            validar.then(responde => {
                let token = responde.token;
                res.cookie("jwt", token, { httpOnly: false, expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) })
                    .json({
                        status: 201, data: responde
                    })
            }).catch(error => {
                res.status(500).json({ status: 500, error: "error" })
            })
        } catch (error) {
            console.log("erorr...");
        }
   }
    async UserRegistre(req, res) {
        //validate data user
        const { values } = req.body
        const { error } = validateRegister.validate(values)
        if (error) {
            return res.status(400).json(
                { error: error.details[0].message }
            )
        }
        try {
            const { values } = req.body
            const { image } = req.body
            const agregar = auth.Users_register(values, image);
            agregar.then((responde) => {
                res.status(201).json({ status: "OK", responde });
            }).catch((error) => {
                res.status(500).json({ status: "FAILDED", error });
            })
        } catch (error) {
            console.log("error..")
        }
    }
    async PostUsers(req, res) {
        const { error } = validateCreate.validate(req.body)
        if (error) {
            return res.status(400).json(
                { error: error.details[0].message }
            )
        }
        try {
            const data = req.body;
            const agregar = services.CreateUsers(data);
            agregar.then((responde) => {
                res.status(201).send({ status: "OK", responde});
            }).catch((error) => {
                res.status(500).send({ status: "FAILDED", error });
            })
        } catch (error) {
            console.log("error..")
        }

    }
    async DeleteUsers(req, res) {
        const data = req.params.cedula
        const remove = services.DeleteUser(data)
        remove.then(responde => {
            res.status(200).json({ status: "ok", data: responde })
        }).catch(error => {
            res.status(500).json({ status: "Failded", data: error })
        })
    }
    async PutUsers(req, res) {
        const cedula = req.params.cedula
        const { RowData } = req.body
        const { image } = req.body
        const update = services.updateUsers(RowData, image , cedula)
        update.then(responde => {
            res.status(200).json({ status: "ok", responde })
        }).catch(error => {
            res.status(500).json({ status: "failded", error })
        })

    }

}


module.exports = UserController;