import * as React from "react";
import { useState, useEffect } from "react";
import { connect } from "socket.io-client";

interface IMessage {
    content: string;
    user: string;
    time: Date | string | number;
}

const App = () => {
    const player = new Audio("http://gauss.ececs.uc.edu/Courses/c653/lectures/AIM/sound/imsend.wav");

    const sawcket = connect("ws://localhost:3000");
    const [username, setUsername] = useState("");
    const [input, setInput] = useState("");
    const [alert, setAlert] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        sawcket.on("hello", newUserLMao => {
            setAlert(`Everyone say hey to ${newUserLMao}!`);
            setTimeout(() => {
                setAlert("");
            }, 2000);
        });

        sawcket.on("update", msgs => {
            setMessages(msgs);
            player.play();
        });
    }, []);

    const handleLogin = () => {
        if (!username) return;
        sawcket.emit("welcome", username);
    };

    const handleChat = () => {
        if (!input) return;
        sawcket.emit("chat", { content: input, user: username });
        setInput("");
    };

    return (
        <main className="container my-5">
            {!username && (
                <>
                    <h1 className="text-primary text-center">Login, losers!</h1>
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                    <button onClick={handleLogin} className="btn btn-primary">
                        Join!
                    </button>
                </>
            )}
            {username && (
                <div>
                    <input value={input} onChange={e => setInput(e.target.value)} />
                    <button onClick={handleChat} className="btn btn-success">
                        Add text to chat!
                    </button>
                    {messages.map(msg => (
                        <p>
                            <strong>@{msg.user}:</strong> &lt;{new Date(msg.time).toLocaleString()}&gt; {msg.content}
                        </p>
                    ))}
                </div>
            )}
            {alert && <div className="alert alert-success">{alert}</div>}
        </main>
    );
};

interface AppProps {}

export default App;
