import { useAuth } from "../context/useAuth";

import GoogleLoginButton from "./GoogleLoginButton";
import UrlShortener from "./UrlShortener";
import UrlList from "./UrlList";

function Dashboard() {

    const { user, logout, loading } = useAuth();

    if (!user) {
        if (loading) {
            return <p>Loading...</p>;
        }
        return (
            <div className="login-page">

                <h1>URL Shortener</h1>

                <p>
                    Shorten, manage and track your links.
                </p>

                <GoogleLoginButton />

            </div>
        );
    }

    return (
        <>
            <header className="navbar">

                <div>
                    <strong>
                        URL Shortener
                    </strong>
                </div>

                <div className="user-section">

                    {user.picture && (
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="profile-picture"
                        />
                    )}

                    <span>
                        {user.name}
                    </span>

                    <button
                        onClick={logout}
                        className="logout-button"
                    >
                        Logout
                    </button>

                </div>

            </header>

            <UrlShortener />

            <UrlList />

        </>
    );
}

export default Dashboard;