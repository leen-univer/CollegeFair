import {
  AccountBalance,
  Approval,
  // ArrowForwardIos,
  ContactMail,
  // CreditScore,
  Dashboard,
  Event,
  ManageAccounts,
  NotificationsRounded,
  Support,
  SupportOutlined,
  // AddCard,
  LibraryAdd,
  ArrowBack,
  School,
  RequestPage,
  ApprovalOutlined,

  // CreditScore,
} from "@mui/icons-material";
// import AddCardIcon from "@mui/icons-material/AddCard";

const MenuItems = [
  {
    key: "1",
    title: "Dashboard",
    icon: <Dashboard className="iconColor" />,
    route: "/dashboard",
  },
  {
    key: "8",
    title: "Schools",
    icon: <School className="iconColor" />,
    route: "/schools",
  },
  {
    key: "8",
    title: "Universities",
    icon: <AccountBalance className="iconColor" />,
    route: "/universities",
  },
  {
    key: "21",
    title: "Requests",
    icon: <Approval className="iconColor" />,
    route: "/requested-universities",
  },
  // {
  // 	key: "25",
  // 	title: "Event Request",
  // 	icon: <ArrowForwardIos className="iconColor" />,
  // 	route: "/requested-event",
  // },

  {
    key: "26",
    title: "Add Credits",
    icon: <LibraryAdd className="iconColor" />,
    route: "/add-credits",
  },

  {
    key: "11",
    title: "Credit Request",
    icon: <SupportOutlined className="iconColor" />,
    route: "/credit-management",
  },
  {
    key: "16asd",
    title: "Fair Requests",
    icon: <ApprovalOutlined className="iconColor" />,
    route: "/school-fair-requests",
  },
  {
    key: "16",
    title: "School Fairs",
    icon: <School className="iconColor" />,
    route: "/school-fairs",
  },
  {
    key: "15",
    title: "Upcoming Fairs",
    icon: <Event className="iconColor" />,
    route: "/student-management",
  },

  {
    key: "7",
    title: "Previous Fairs",
    icon: <ArrowBack className="iconColor" />,
    route: "/previous-fairs",
  },
  {
    key: "9",
    title: "Contacts",
    icon: <ContactMail className="iconColor" />,
    route: "/contacts",
  },
  {
    key: "10",
    title: "Supports",
    icon: <Support className="iconColor" />,
    route: "/supports",
  },

  {
    key: "3",
    title: "Notifications",
    icon: <NotificationsRounded className="iconColor" />,
    route: "/notifications",
  },
  {
    key: "2",
    title: "Account Settings",
    icon: <ManageAccounts className="iconColor" />,
    route: "/account-settings",
  },
];

export default MenuItems;
