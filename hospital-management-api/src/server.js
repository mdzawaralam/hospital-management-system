import "dotenv/config";

import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Hospital management API running on port ${PORT}`);
});

// handle expected server errors
server.on("error", (error) => {
    console.error("server startup error: ", error);
    process.exit();
});