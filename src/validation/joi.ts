import Joi from "joi";

const JoiDefaults = Joi.defaults((scheme) =>
    scheme.options({ abortEarly: false })
);

export const statusSchema = JoiDefaults.object({
    status: Joi.string()
        .valid("daily", "scheduled") // excludes "cancelled"
        .required()
        .messages({ "any.only": "Error, status not valid" }),
});

export const idSchema = JoiDefaults.object({
    id: Joi.string().min(1).max(11).required(),
});

// Only backend
export const filterSchema = JoiDefaults.object({
    start: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
    end: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
});

export const statisticfilterSchema = statusSchema.keys({
    start: Joi.string().required(),
    end: Joi.string().required(),
});

const emailItfipSchema = JoiDefaults.object({
    email: Joi.string()
        .min(10)
        .max(30)
        .email({
            minDomainSegments: 3,
            maxDomainSegments: 3,
            tlds: { allow: ["co"] },
        })
        .regex(/^[A-Za-z0-9._%+-]+@itfip\.edu\.co$/)
        .required()
        .messages({
            "string.pattern.base":
                '"email" does not belong to the itfip.edu.co domain',
        }),
});

export const authSchema = JoiDefaults.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(30).required(),
});

export const cancellSchema = idSchema.keys({
    date: Joi.string().required(),
    cancelled_asunt: Joi.string().min(10).max(150).required(),
});

export const cancellationSchema = JoiDefaults.object({
    person_id: Joi.string().min(1).max(11).required(),
    cancelled_asunt: Joi.string().min(10).max(150).required(),
});

export const changePswSchema = idSchema.keys({
    current_password: Joi.string().min(8).max(30).required(),
    new_password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .invalid(Joi.ref("current_password"))
        .messages({
            "any.invalid":
                "The new password must be different from the old password",
        }),
    new_password_confirm: Joi.string()
        .valid(Joi.ref("new_password"), "")
        .min(8)
        .max(30)
        .required()
        .invalid(Joi.ref("current_password"))
        .messages({
            "any.invalid":
                "The new password must be different from the old password",
            "any.only": "Passwords does not match",
        }),
});

export const recoverPswSchema = emailItfipSchema.keys({
    APP_ROUTE: Joi.string().uri().required(),
});

export const forgetPswSchema = JoiDefaults.object({
    resetToken: Joi.string().required(),
    password: Joi.string().min(8).max(30).required(),
    password_confirm: Joi.string()
        .valid(Joi.ref("password"), "")
        .min(8)
        .max(30)
        .required()
        .messages({ "any.only": "Passwords does not match" }),
});

export const deanSchema = JoiDefaults.object({
    _id: Joi.string()
        .regex(/^[0-9]+$/)
        .min(8)
        .max(10)
        .required()
        .messages({ "string.pattern.base": '"document" invalid' }),
    dean: Joi.string().min(8).max(50).required(),
    facultie_id: Joi.string().length(1).required(),
});

export const userSchema = emailItfipSchema.keys({
    role: Joi.string().length(1).required(),
    name: Joi.string().min(3).max(25).required(),
    lastname: Joi.string().min(3).max(25).required(),
    docType: Joi.string().length(1).required(),
    doc: Joi.string()
        .regex(/^[0-9]+$/)
        .min(8)
        .max(10)
        .required()
        .messages({ "string.pattern.base": '"document" invalid' }),
    tel: Joi.string()
        .regex(/^[0-9]+$/)
        .length(10)
        .required()
        .messages({ "string.pattern.base": '"telephone" invalid' }),
    password: Joi.string().min(8).max(30).required(),
    passwordConfirmation: Joi.string()
        .valid(Joi.ref("password"))
        .min(8)
        .max(30)
        .required()
        .messages({ "any.only": "Passwords does not match" }),
});

export const peopleEditSchema = idSchema.keys({
    person: Joi.string().length(1).required(),
    name: Joi.string().min(8).max(50).required(),
    doctype: Joi.string().length(1).required(),
    doc: Joi.string()
        .regex(/^[0-9]+$/)
        .min(8)
        .max(10)
        .required()
        .messages({ "string.pattern.base": '"document" invalid' }),
    facultie: Joi.string().length(1).required(),
    asunt: Joi.string().min(10).max(150).required(),
});

export const scheduleSchema = statusSchema.keys({
    person_id: Joi.string().min(1).max(11).required(),
    color: Joi.string().min(4).max(7).required(),
    date_filter: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
    start_date: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
    end_date: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
});

export const schedulerSchema = statusSchema.keys({
    person: Joi.string().length(1).required(),
    name: Joi.string().min(8).max(50).required(),
    doctype: Joi.string().length(1).required(),
    doc: Joi.string()
        .regex(/^[0-9]+$/)
        .min(8)
        .max(10)
        .required()
        .messages({ "string.pattern.base": '"document" invalid' }),
    emailContact: Joi.when("status", {
        is: "scheduled",
        then: Joi.string()
            .min(10)
            .max(30)
            .email({
                minDomainSegments: 2,
                maxDomainSegments: 3,
                tlds: { allow: false },
            })
            .required(),
        otherwise: Joi.optional(),
    }),
    telContact: Joi.when("status", {
        is: "scheduled",
        then: Joi.string()
            .regex(/^[0-9]+$/)
            .length(10)
            .messages({ "string.pattern.base": '"telephone" invalid' })
            .required(),
        otherwise: Joi.optional(),
    }),
    facultie: Joi.string().length(1).required(),
    asunt: Joi.string().min(10).max(150).required(),
    color: Joi.string().min(4).max(7).required(),
    date: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
    start: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
    end: Joi.when("status", {
        is: "scheduled",
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
});
