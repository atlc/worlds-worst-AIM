import * as express from "express";
import * as cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.static("public"));

const port = process.env.PORT || 3000;

const socketServer = new Server(app.listen(port, () => console.log(`Server listening on port: ${port}`)));

let messages: IMessage[] = [];
let usersTyping: string[] = [];

socketServer.on("connection", socket => {
    socket.on("welcome", newUser => {
        socketServer.emit("hello", newUser);
    });

    socket.on("typing", user => {
        usersTyping.push(user);

        socketServer.emit("activeTypers", usersTyping);
    });

    socket.on("stoppedTyping", user => {
        usersTyping = usersTyping.filter(usr => usr !== user);

        socketServer.emit("activeTypers", usersTyping);
    });

    socket.on("chat", (message: IMessage) => {
        messages = [...messages, { ...message, content: message.content.replace("hunter2", "*******"), time: Date.now() }]
            .sort((a, b) => (b.time as number) - (a.time as number))
            .slice(0, 20)
            .reverse();

        socketServer.emit("update", messages);
    });
});

interface IMessage {
    content: string;
    user: string;
    time: Date | string | number;
}
