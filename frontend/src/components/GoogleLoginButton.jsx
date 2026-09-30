import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/useAuth";

function GoogleLoginButton() {

    const { login } = useAuth();

    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/google`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        credential:
                            credentialResponse.credential
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Authentication failed"
                );
            }

            login(data.user);

        } catch (error) {
            console.error(
                "Login error:",
                error.message
            );
        }
    };

    const handleError = () => {
        console.log("Google login failed");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
        />
    );
}

export default GoogleLoginButton;