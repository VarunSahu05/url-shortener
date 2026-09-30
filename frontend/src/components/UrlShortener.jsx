import { useState } from "react";

function UrlShortener() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setShortUrl("");

        if (!originalUrl.trim()) {
            setError("Please enter a URL");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/urls`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        originalUrl
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setShortUrl(data.shortUrl);
            setOriginalUrl("");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(shortUrl);
    };

    return (
        <div className="shortener-container">

            <h1>URL Shortener</h1>

            <p>
                Turn long URLs into short, shareable links.
            </p>

            <form onSubmit={handleSubmit}>

                <input
                    type="url"
                    placeholder="Paste your long URL..."
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Shortening..." : "Shorten URL"}
                </button>

            </form>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {shortUrl && (
                <div className="result">

                    <p>Your shortened URL:</p>

                    <div className="short-url">
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {shortUrl}
                        </a>

                        <button onClick={copyToClipboard}>
                            Copy
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}

export default UrlShortener;