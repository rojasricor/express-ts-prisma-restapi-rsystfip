import sgMail, { MailDataRequired, ResponseError } from "@sendgrid/mail";
import { FROM_EMAIL, SENDGRID_API_KEY } from "../config";

export async function sendEmail(to: string, subject: string, html: string) {
    sgMail.setApiKey(SENDGRID_API_KEY as string);

    const msg: MailDataRequired = {
        to,
        from: FROM_EMAIL as string,
        subject,
        html,
    };

    try {
        const [response] = await sgMail.send(msg);
        return { response: response.statusCode === 202 };
    } catch (error: ResponseError | any) {
        console.error(error);
    }
}
