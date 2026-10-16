import http from "http";
import {createApp} from "./app.js";
import mongoose from "mongoose";
import {logger} from "./pkg/logger/logger.js";
import {env} from "./lib/config/env.js";


const app = createApp()
const server = http.createServer(app);

server.listen(env.port,()=> logger.info("Server started on port 3000"));
async function shutdown() {
   server.close(async () => {
       await mongoose.disconnect();
       process.exit(0);
   });
}

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);