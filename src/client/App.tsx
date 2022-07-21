import * as React from "react";
import { MdFormatBold, MdFormatItalic, MdClose, MdCropSquare, MdMinimize, MdFormatUnderlined } from "react-icons/md";
import { BsEmojiSunglasses } from "react-icons/bs";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FcPicture } from "react-icons/fc";
import { useState, useEffect } from "react";
import { connect } from "socket.io-client";

interface IMessage {
    content: string;
    user: string;
    time: Date | string | number;
}

const App = () => {
    const sawcket = connect("ws://");
    const [username, setUsername] = useState("");
    const [input, setInput] = useState("");
    const [alert, setAlert] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [hasJoined, setHasJoined] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = "#ebe8d5";
        document.body.style.border = "15px solid #0159ef";
        document.body.style.minHeight = "100vh";

        const player = new Audio("/assets/bloop.wav");
        sawcket.on("hello", newUserLMao => {
            setAlert(`Everyone say hey to ${newUserLMao}!`);
            setTimeout(() => {
                setAlert("");
            }, 2000);
        });

        sawcket.on("update", msgs => {
            setMessages(msgs);
            player.pause();
            player.currentTime = 0;
            player.play();
        });
    }, []);

    const handleLogin = () => {
        if (!username) return;
        setHasJoined(true);
        sawcket.emit("welcome", username);
    };

    const handleChat = () => {
        if (!input) return;
        sawcket.emit("chat", { content: input, user: username });
        setInput("");
    };

    const addMessageIfEnter = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.key === "Enter") {
            if ((e.target as HTMLTextAreaElement).name === "usernameInput") handleLogin();

            if ((e.target as HTMLTextAreaElement).name === "chatInput") handleChat();
        }
    };

    return (
        <div>
            <div className="text-end span-parent pb-1" style={{ fontSize: "1.8rem", backgroundColor: "#0159ef" }}>
                <span style={{ color: "white", border: "2px solid white" }}>
                    <MdMinimize />
                </span>
                <span style={{ color: "white", border: "2px solid white" }}>
                    <MdCropSquare />
                </span>
                <span style={{ color: "white", backgroundColor: "#c5381f", border: "2px solid white" }}>
                    <MdClose />
                </span>
            </div>
            <div style={{ backgroundColor: "#ebe8d5", minHeight: "90vh", maxHeight: "90vh" }}>
                <main className="container">
                    {!hasJoined && (
                        <div className="mt-5 row justify-content-center">
                            <div className="row justify-content-center border border-black">
                                <label htmlFor="usernameInput">Enter your username:</label>
                                <input name="usernameInput" onKeyDown={addMessageIfEnter} value={username} onChange={e => setUsername(e.target.value)} />
                                <button onClick={handleLogin}>Sign in!</button>
                            </div>
                        </div>
                    )}
                    {hasJoined && (
                        <div style={{ height: "50%" }} className="row justify-content-center align-center">
                            <div className="chatPane">
                                {messages.map((msg, index) => (
                                    <p key={`chat-message-${index + 1}`}>
                                        <strong style={{ color: index % 2 ? "red" : "blue", fontSize: "1.2rem" }}>{msg.user}:</strong> &lt;{new Date(msg.time).toLocaleString()}&gt; {msg.content}
                                    </p>
                                ))}
                            </div>
                            <div className="text-center button-panel">
                                <span>
                                    <MdFormatBold />
                                </span>
                                <span>
                                    <MdFormatItalic />
                                </span>
                                <span>
                                    <MdFormatUnderlined />
                                </span>
                                <span>
                                    <a href="#">link</a>{" "}
                                </span>
                                <span>
                                    <FcPicture />
                                </span>
                                <span style={{ backgroundColor: "#d6dd54" }}>
                                    <BsEmojiSunglasses />
                                </span>
                                <span style={{ backgroundColor: "#d6dd54" }}>
                                    <HiOutlineMailOpen />
                                </span>
                            </div>
                            <textarea name="chatInput" onKeyDown={addMessageIfEnter} value={input} onChange={e => setInput(e.target.value)} />
                        </div>
                    )}
                    {alert && <div className="alert alert-success">{alert}</div>}
                </main>
            </div>
        </div>
    );
};

interface AppProps {}

export default App;
