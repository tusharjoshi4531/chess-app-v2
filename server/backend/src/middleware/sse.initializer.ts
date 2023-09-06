import { RequestHandler } from "express";

export const sseInitializer: RequestHandler = (req, res, next) => {
    res.writeHead(200, {
        "cache-control": "no-cache",
        "content-type": "text/event-stream",
        connection: "keep-alive",
    });

    const ssid = new Date().toLocaleTimeString();
    req.body.ssid = ssid;

    req.on("close", () => {
        console.log("Client disconnected");
        res.end();
    });

    next();
};
