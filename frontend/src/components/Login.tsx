import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from "../styles/Login.module.css";


interface LoginInfo {
	username: string,
	password: string,
}

type Props = {
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}



export default function ({ setIsLoggedIn }: Props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [errorShake, setErrorShake] = useState(false);

	const navigate = useNavigate();


	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();


		const loginInfo: LoginInfo = {
			username: username,
			password: password,
		}; 
		

		fetch("http://localhost:8000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginInfo),

		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.code == 1) {
					// console.log("Returned data:", data);
					document.cookie = `sessionId=${data.sessionId}`;
					setMessage(data.message);
					setIsLoggedIn(true)
					navigate("/mydecks")
				} else {
					setMessage(data.message);
					setIsLoggedIn(false)
					setErrorShake(true);
					setTimeout(() => setErrorShake(false), 400);
				}

			})
			.catch(error => {
				console.error(error);
			});
	}


	return (
	<div className={styles.main_wrapper}>
		<form 
			action="submit" 
			method="post"
			onSubmit={(e) => handleSubmit(e)}
			className={`${styles.login_wrapper} ${errorShake && styles.error_shake}`}
		>
			<div className={styles.header}>Log in</div>
			<div className={styles.username}>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div className={styles.password}>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button className={styles["login_button"]} type="submit">Log in</button>
		</form>
		<div className={styles.message}>{message}</div>
	</div>
	)
}

