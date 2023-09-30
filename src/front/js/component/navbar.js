import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {

	const { store, actions } = useContext(Context)

	return (
		<nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
		<div className="container-fluid">
			<Link to='/' className="navbar-brand">JWT Auth Assessment</Link>
			<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarColor03">
			
				<Link to="/" className="nav-link active">
					Home
				</Link>
				
			<form className="d-flex">
				<Link to="/signup" className="nav-link active">
					Sign up
				</Link>	
				{/* Si el toquen no existe va a log in para ingresar */}
				{!store.token ? (
				<Link to="/login" className="nav-link active">
					Log in
				</Link>
				):(
				<Link to="/login" className="nav-link active" onClick={() => actions.logout()}>
					Log out
				</Link>			
				)}
			</form>
			</div>
		</div>
		</nav>
	);
};
