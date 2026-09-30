import { useEffect, useState } from "react";

function UrlList() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this URL?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/urls/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete URL"
                );
            }

            setUrls((currentUrls) =>
                currentUrls.filter((url) => url._id !== id)
            );

        } catch (error) {
            setError(error.message);
        }
    };
    const handleClearHistory = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your entire URL history?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/urls`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to clear history"
                );
            }

            setUrls([]);

        } catch (error) {
            setError(error.message);
        }
    };
    useEffect(() => {
        let cancelled = false;

        async function loadUrls() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/urls`,
                    {
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch URLs"
                    );
                }

                if (!cancelled) {
                    setUrls(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(error.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadUrls();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <p>Loading URLs...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="url-list">
            <div className="history-header">
                <h2>Your URLs</h2>

                {urls.length > 0 && (
                    <button
                        className="clear-button"
                        onClick={handleClearHistory}
                    >
                        Clear History
                    </button>
                )}

             </div>

            {urls.length === 0 ? (
                <p>No URLs created yet.</p>
            ) : (
                urls.map((url) => (
                    <div className="url-card" key={url._id}>
                        <div>
                            <p className="original-url">
                                {url.originalUrl}
                            </p>

                            <a
                                href={`${import.meta.env.VITE_API_URL}/${url.shortCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {import.meta.env.VITE_API_URL}/{url.shortCode}
                            </a>
                        </div>

                        <div className="url-actions">

                            <div className="url-stats">
                                <span>
                                    Clicks: {url.clicks}
                                </span>
                                <span>
                                    Last clicked:{" "}
                                    {url.lastClickedAt
                                        ? new Date(url.lastClickedAt).toLocaleString()
                                        : "Never"}
                                </span>

                                <span>
                                    Created:{" "}
                                    {new Date(
                                        url.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <button
                                className="delete-button"
                                onClick={() => handleDelete(url._id)}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default UrlList;
