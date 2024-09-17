import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from "./SignInForm";

const SignUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [controlPassword, setControlPassword] = React.useState("");
    const [showTermsPopup, setShowTermsPopup] = React.useState(false); // Nouvel état

    const handleRegister = async (e) => {
        e.preventDefault();
        const terms = document.getElementById("terms");
        const usernameError = document.querySelector(".username.error");
        const emailError = document.querySelector(".email.error");
        const passwordError = document.querySelector(".password.error");
        const passwordConfirmError = document.querySelector(".password-confirm.error");
        const termsError = document.querySelector(".terms.error");

        passwordConfirmError.innerHTML = "";
        termsError.innerHTML = "";

        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword) {
                passwordConfirmError.innerHTML = "Passwords do not match";
            }
            if (!terms.checked) {
                termsError.innerHTML = "Please accept the terms of use";
            }
        } else {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                withCredentials: true,
                data: {
                    username, // Modifié
                    email,
                    password_hash: password // Modifié
                }
            })
                .then((res) => {
                    if (res.data.errors) {
                        usernameError.innerHTML = res.data.errors.username;
                        emailError.innerHTML = res.data.errors.email;
                        passwordError.innerHTML = res.data.errors.password;
                    } else {
                        setFormSubmit(true);
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <>
            {formSubmit ? (
                <>
                    <SignInForm />
                    <span></span>
                    <h4 className="success">Registration successful, please log in</h4>
                </>
            ) : (
                <form action="" onSubmit={handleRegister} id="sign-up-form">
                    <label htmlFor="username">Username</label>
                    <br />
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username} />
                    <div className="username error"></div>
                    <br />
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email} />
                    <div className="email error"></div>
                    <br />
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} />
                    <div className="password error"></div>
                    <br />
                    <label htmlFor="password-conf">Confirm Password</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password-conf"
                        onChange={(e) => setControlPassword(e.target.value)}
                        value={controlPassword} />
                    <div className="password-confirm error"></div>
                    <br />
                    <input type="checkbox" id="terms" />
                    <label htmlFor="terms">
                        I accept the <span onClick={() => setShowTermsPopup(true)} style={{ color: 'blue', cursor: 'pointer' }}>terms of use</span>
                    </label>
                    <div className="terms error"></div>
                    <br />
                    <br />
                    <input type="submit" value="Submit Registration" />
                </form>
            )}

            {showTermsPopup && (
                <div className="popup-profil-container">
                    <div className="modal">
                    <h3>Terms of Use</h3>
                        <p>
                            Welcome to our community platform dedicated to sharing artistic creations related to the Pokémon universe. By using our site, you agree to the following terms of use:
                            <br /><br />
  
                            <strong>1. Acceptance of Terms</strong><br />
                            By accessing our site and using our services, you agree to comply with these terms of use. If you disagree with any of these terms, please stop using the platform.
                            <br /><br />
  
                            <strong>2. Intellectual Property and Copyright</strong><br />
                            The creations shared on the platform must respect copyright and trademarks, including those of Pokémon and Nintendo. By submitting a creation, you warrant that you are the author or have the necessary rights to share it.
                            <br /><br />
  
                            <strong>3. Inappropriate Content</strong><br />
                            Users are not allowed to share inappropriate, offensive, or illegal content. Any content deemed inappropriate will be removed, and the user may be banned from the platform.
                            <br /><br />
  
                            <strong>4. Use of Your Creations</strong><br />
                            By sharing a creation on the platform, you allow the platform to display, distribute, and promote your content as part of its activities. However, you retain all rights to your creations.
                            <br /><br />
  
                            <strong>5. Data Privacy</strong><br />
                            We are committed to protecting your personal data in accordance with applicable laws. The information you share with us will only be used to enhance your experience on the platform.
                            <br /><br />
  
                            <strong>6. User Conduct</strong><br />
                            All users must respect each other. Harassment, discrimination, or any form of abusive behavior will not be tolerated.
                            <br /><br />
  
                            <strong>7. Modification of Terms</strong><br />
                            We reserve the right to modify these terms at any time. You will be notified of any major changes, and your continued use of the platform will signify your acceptance of the new terms.
                        </p>
                        <div className="cross" onClick={() => setShowTermsPopup(false)}>X</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SignUpForm;

