import { Container, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LOGO } from "assets";
import TemporaryDrawer from "./Drawer";

const Navbar = () => {
	const navigate = useNavigate();
	return (
		<Container>
			<div className="navbar-body">
				<div className="nav-container">
					<span>
						<img src={LOGO} alt="logo" className="image-logo" />
					</span>
					<TemporaryDrawer />
				</div>
				<div className="nav-container">
					<div className="left-nav display">
						<Link className="nav-link change_new_clr" href="">
							Home
						</Link>
					</div>
					<div className="right-nav display">
						<a href="#ContactUs" className="nav-link change_new_clr ">
							Contact Us
						</a>
						<div
							className="btn-outlined change_new_clr"
							onClick={() => navigate("/login")}
						>
							Login
						</div>
						<div
							className="btn-container change_new_bg_clr"
							onClick={() => navigate("/university-register")}
						>
							Register
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Navbar;
