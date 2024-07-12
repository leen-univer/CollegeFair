import { Fragment } from "react";
import {
	Box,
	List,
	Typography,
	IconButton,
	ListItemIcon,
	ListItemText,
	useTheme,
	Tooltip,
	Button,
	ListItemButton,
} from "@mui/material";
import { ExitToApp, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { MenuItems, UniversityMenuItems } from "configs";
import { useAppContext } from "contexts";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CustomDrawer, CustomDrawerHeader } from "./custom";
import { LOGO } from "assets";
import Scrollbars from "react-custom-scrollbars";
import SchoolMenuItems from "configs/SchoolMenuItems";
const DrawerLayout = ({ isDrawerOpen, handleDrawerClose }) => {
	const { user } = useAppContext();
	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAppContext();
	const handleLogout = () => {
		try {
			logout();
			// setUser({});
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};
	const renderMenuByRole = () => {
		switch (user?.role) {
			case "superadmin":
				return MenuItems.map((item) => (
					<Fragment key={item.key}>
						<Tooltip title={item.title} followCursor arrow placement="top-end">
							<ListItemButton
								component={Link}
								to={item.route}
								selected={location.pathname === item.route}
								className={
									location.pathname === item.route ? "selectedItem" : "listItem"
								}
							>
								<ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
								<ListItemText primary={item.title} className="listItemText" />
							</ListItemButton>
						</Tooltip>
						{/* <Divider /> */}
					</Fragment>
				));
			case "university":
				return UniversityMenuItems.map((item) => (
					<Fragment key={item.key}>
						<Tooltip title={item.title} followCursor arrow placement="top-end">
							<ListItemButton
								component={Link}
								to={item.route}
								selected={location.pathname === item.route}
								className={
									location.pathname === item.route ? "selectedItem" : "listItem"
								}
							>
								<ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
								<ListItemText primary={item.title} className="listItemText" />
							</ListItemButton>
						</Tooltip>
						{/* <Divider /> */}
					</Fragment>
				));
			case "school":
				return SchoolMenuItems.map((item) => (
					<Fragment key={item.key}>
						<Tooltip title={item.title} followCursor arrow placement="top-end">
							<ListItemButton
								component={Link}
								to={item.route}
								selected={location.pathname === item.route}
								className={
									location.pathname === item.route ? "selectedItem" : "listItem"
								}
							>
								<ListItemIcon className="itemIcon">{item.icon}</ListItemIcon>
								<ListItemText primary={item.title} className="listItemText" />
							</ListItemButton>
						</Tooltip>
						{/* <Divider /> */}
					</Fragment>
				));
			default:
				break;
		}
	};
	return (
		<>
			<CustomDrawer variant="permanent" open={isDrawerOpen}>
				<CustomDrawerHeader>
					<div style={{ paddingRight: "22px" }}>
						<img
							src={LOGO}
							alt=""
							width="140"
							className="layoutLogo"
							style={{ paddingRight: "5px" }}
						/>
					</div>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</CustomDrawerHeader>
				{/* <Divider /> */}
				{/* Render Menu Items */}
				<Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
					<List sx={{ marginTop: "1px" }}>
						{renderMenuByRole()}
						<Box hidden={isDrawerOpen}>
							<Tooltip
								title={"Click Here To Logout"}
								followCursor
								arrow
								placement="top-end"
							>
								<ListItemButton onClick={handleLogout}>
									<ListItemIcon>
										<ExitToApp className="iconColor" />
									</ListItemIcon>
									<ListItemText primary={"Logout"} />
								</ListItemButton>
							</Tooltip>
						</Box>
					</List>

					<Box
						hidden={!isDrawerOpen}
						sx={{
							textAlign: "center",
						}}
					>
						{/* <Typography>Hi User,</Typography>
            <Typography variant="caption">
              Click here to logout from panel
            </Typography> */}
						<div className="">
							<Button
								variant="contained"
								onClick={handleLogout}
								startIcon={<ExitToApp />}
								color="error"
								className="mt-1vh gradient"
							>
								Logout
							</Button>
						</div>
					</Box>
				</Scrollbars>
			</CustomDrawer>
		</>
	);
};

export default DrawerLayout;
