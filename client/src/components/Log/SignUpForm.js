import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from "./SignInForm";

const SignUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [controlPassword, setControlPassword] = React.useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const terms = document.getElementById("terms");
        const pseudoError = document.querySelector(".pseudo.error");
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
                    pseudo,
                    email,
                    password
                }
            })
                .then((res) => {
                    if (res.data.errors) {
                        pseudoError.innerHTML = res.data.errors.pseudo;
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
            <label htmlFor="pseudo">Pseudo</label>
            <br />
            <input
                type="text"
                name="pseudo"
                id="pseudo"
                onChange={(e) => setPseudo(e.target.value)}
                value={pseudo} />
            <div className="pseudo error"></div>
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
            <label htmlFor="password-conf">Confirm Pseudo</label>
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
                I accept the <a href="/" target="_blank" rel="noopener noreferrer">terms of use</a>
            </label>
            <div className="terms error"></div>
            <br />
            <br />
            <input type="submit" value="Submit Registration" />
        </form>
            )}
        </>
    );
};

export default SignUpForm;