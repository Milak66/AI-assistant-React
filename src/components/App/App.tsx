import { useState } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { onAddMessage } from "../reducer/reducer";
import { Message } from "../reducer/reducer";
import funner from "../../assets/funner.jpg";

function App() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messages = useSelector(
        (state: RootState) => state.reduser.messages
    );

    const dispatch = useDispatch<AppDispatch>();

    const sendMessage = async () => {
        if (!input.trim() || loading) {
            return;
        }
    
        const text = input.trim();
    
        const userMessage: Message = {
            text,
            id: Date.now(),
            sender: "user",
        };
    
        dispatch(onAddMessage(userMessage));
    
        setInput("");
        setLoading(true);
    
        try {
            const response = await fetch(`${import.meta.env.AI_SERVER_LINK}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to get response from AI");
            }
    
            const data: { text: string } = await response.json();
    
            const aiMessage: Message = {
                text: data.text,
                id: Date.now() + 1,
                sender: "ai",
            };
    
            dispatch(onAddMessage(aiMessage));
        } catch (err: unknown) {
            const errorText =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";
    
            const errorMessage: Message = {
                text: errorText,
                id: Date.now() + 1,
                sender: "ai",
            };
    
            dispatch(onAddMessage(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <main className="app">
            <section className="assistant">
                <header className="assistant-header">
                    <div className="assistant-title">
                        <div className="assistant-icon">
                            <img className="funner-img" src={funner} alt="" />
                        </div>

                        <div className="title-content">
                            <h1>FUNner</h1>

                            <div className="status">
                                <span className="status-dot" />
                                <span>Online</span>
                            </div>
                        </div>
                    </div>

                    <button className="clear-button">
                        Clear
                    </button>
                </header>

                <div className="chat">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-row ${message.sender}`}
                        >
                            {message.sender === "ai" && (
                                <div className="message-avatar">
                                    <img className="funner-img-message" src={funner} alt="" />
                                </div>
                            )}

                            <div className="message-wrapper">
                                <span className="message-name">
                                    {message.sender === "user"
                                        ? "You"
                                        : "FUNner"}
                                </span>

                                <div className="message">
                                    {message.text}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="message-row ai">
                            <div className="message-avatar">
                                ✦
                            </div>

                            <div className="message-wrapper">
                                <span className="message-name">
                                    FUNner
                                </span>

                                <div className="message typing">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bottom-area">
                    <div className="input-area">
                        <textarea
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Message AI Assistant..."
                            rows={1}
                        />

                        <button
                            className="send-button"
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M22 2L11 13" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                            </svg>
                        </button>
                    </div>

                    <p className="hint">
                        Enter to send · Shift + Enter for new line
                    </p>
                </div>
            </section>
        </main>
    );
}

export default App;