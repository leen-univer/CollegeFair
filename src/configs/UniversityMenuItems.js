import {
	ArrowBack,
	ArrowBackIos,
	ArrowForwardIos,
	CreditScore,
	Dashboard,
	Event,
	ManageAccounts,
	NotificationsRounded,
	School,
	Support,
} from "@mui/icons-material";
const UniversityMenuItems = [
	{
		key: "1",
		title: "Dashboard",
		icon: <Dashboard className="iconColor" />,
		route: "/dashboard",
	},
	// {
	//   key: "12",
	//   title: "School Fairs",
	//   icon: <School className="iconColor" />,
	//   route: "/university-fairs",
	// },
	{
		key: "2",
		title: "Fairs",
		icon: <Event className="iconColor" />,
		route: "/leads",
	},
	{
		key: "10",
		title: "Previous Fairs",
		icon: <ArrowBackIos className="iconColor" />,
		route: "/previous-fairs",
	},

	{
		key: "4",
		title: "My Upcoming Fairs",
		icon: <ArrowForwardIos className="iconColor" />,
		route: "/upcoming-fairs",
	},
	{
		key: "9",
		title: "Attended Fairs",
		icon: <ArrowBack className="iconColor" />,
		route: "/exclusive-leads",
	},
	{
		key: "7",
		title: "Credits",
		icon: <CreditScore className="iconColor" />,
		route: "/credits",
	},
	{
		key: "8",
		title: "University Support",
		icon: <Support className="iconColor" />,
		route: "/university-support",
	},
	{
		key: "6",
		title: "Notifications",
		icon: <NotificationsRounded className="iconColor" />,
		route: "/notifications",
	},
	{
		key: "5",
		title: "Account Settings",
		icon: <ManageAccounts className="iconColor" />,
		route: "/account-settings",
	},
];
export default UniversityMenuItems;
