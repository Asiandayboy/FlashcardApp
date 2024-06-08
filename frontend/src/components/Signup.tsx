import React from 'react';
import { useState } from 'react';
import styles from "../styles/Signup.module.css"
import { useNavigate } from 'react-router-dom';



interface SignUpInfo {
	username: string,
	password: string,
	email: string,
}

type Props = {
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
}



export default function Signup({ setIsLoggedIn }: Props) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [response, setResponse] = useState("");
	const [errorShake, setErrorShake] = useState(false);


	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (username == "" || password == "" || email == "") {
			if (errorShake) return;
			setErrorShake(true)
			setTimeout(() => setErrorShake(false), 400);
			setResponse("Error: Make sure to fill every field");
			return;
		}

		const newSignUpInfo: SignUpInfo = {
			username: username,
			password: password,
			email: email
		};

		fetch('http://localhost:8000/signup', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newSignUpInfo),
		})
			.then((response) => {
				if (response.status == 409) {
					setResponse("Username already taken");
					throw new Error("Username already taken");
				} else if (response.status == 200)
					return response.json();
				else if (response.status == 400)
					throw new Error("Invalid JSON input");
				else if (response.status == 500) 
					throw new Error("Network error");
			})
			.then((data) => {
				console.log("Success:", data);
				document.cookie = `sessionId=${data.sessionId}`;
				setIsLoggedIn(true);
				setResponse(data.message);
			})
			.catch((error) => {
				console.error(error);
			});


	}


	return (
		<div className={styles.main_wrapper}>
			<form 
				action="submit" 
				method="post"
				onSubmit={(e) => handleSubmit(e)}
				className={`${styles.signup_wrapper} ${errorShake && styles.error_shake}`}
			>
				<div className={styles.header}>Sign up</div>
				<div className={styles.username}>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className={styles.password}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className={styles.email}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<button className={styles["signup_button"]} type="submit">Sign up</button>
			</form>
			<div className={styles.message}>
				{response}
			</div>
		</div>
	)
}
