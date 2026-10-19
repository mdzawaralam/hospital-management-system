
import "dotenv/config";
import amqp from "amqplib";
import nodemailer from "nodemailer";

const QUEUE_NAME = "hospital_email_queue";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function startWorker() {

    const rabbitUrl = process.env.RABBITMQ_URL;

    console.log("RabbitMQ URL exists:", Boolean(rabbitUrl));
    console.log("RabbitMQ URL protocol:", rabbitUrl?.split(":")[0]);

    const connection = await amqp.connect(rabbitUrl);

    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1);

    console.log("Hospital email worker is running");

    channel.consume(QUEUE_NAME, async (message) => {
        if (!message) return;

        try {
            const email = JSON.parse(message.content.toString());

            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email.to,
                subject: email.subject,
                text: email.text,
            });

            channel.ack(message);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Email processing failed:", error.message);

            // Requeue for retry. Add retry limits/dead-letter handling
            // before using this approach in production.
            channel.nack(message, false, true);
        }
    });
}

startWorker().catch((error) => {
    console.error("Email worker failed to start:", error.message);
    process.exitCode = 1;
});
