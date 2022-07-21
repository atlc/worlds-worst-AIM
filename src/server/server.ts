import * as express from "express";
import * as cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.static("public"));

const port = process.env.PORT || 3000;

const socketBoi = new Server(app.listen(port, () => console.log(`Server listening on port: ${port}`)));

let messages: IMessage[] = [];

socketBoi.on("connection", socket => {
    socket.on("welcome", newUser => {
        socketBoi.emit("hello", newUser);
    });

    socket.on("chat", (message: IMessage) => {
        messages = [{ ...message, time: Date.now() }, ...messages];
        socketBoi.emit("update", messages);
    });
});

interface IMessage {
    content: string;
    user: string;
    time: Date | string | number;
}
