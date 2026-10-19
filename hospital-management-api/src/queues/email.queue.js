
import amqp from "amqplib";

const QUEUE_NAME = "hospital_email_queue";

let connection;
let channel;

export async function publishEmail(emailData) {
    if (!channel) {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createConfirmChannel();

        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        connection.on("close", () => {
            connection = undefined;
            channel = undefined;
        });

        connection.on("error", (error) => {
            console.error("RabbitMQ connection error:", error.message);
        });
    }

    channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify(emailData)),
        { persistent: true }
    );

    await channel.waitForConfirms();
}
