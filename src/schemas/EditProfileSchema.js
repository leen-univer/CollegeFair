import {
	AccountBalance,
	ContactMail,
	Email,
	HomeOutlined,
	LocationCity,
	Person,
	Web,
} from "@mui/icons-material";
import { countries } from "configs";
import * as Yup from "yup";
const url_regex =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const EditProfileSchema = [
	{
		key: "1",
		label: "University Name",
		name: "displayName",
		validationSchema: Yup.string()
			.required("Name is Required")
			.min(3, "Name must be at least 3 characters")
			.max(50, "Name must be less than 150 characters"),
		initialValue: "",
		startIcon: <AccountBalance />,
	},
	{
		key: "4",
		label: "Phone Number",
		name: "phoneNumber",
		type: "tel",
		validationSchema: Yup.string()
			.required("Phone Number is Required")
			.min(5, "Phone Number must be at least 5 characters")
			.max(15, "Phone Number must be less than 15 characters"),
		initialValue: "",
		startIcon: <ContactMail />,
	},
	{
		key: "2",
		label: "Email",
		name: "email",
		type: "email",

		initialValue: "",
		startIcon: <Email />,
	},

	{
		key: "5",
		label: "location",
		name: "location",
		type: "text",
		validationSchema: Yup.string()
			.required("location is Required")
			.min(3, "location must be at least 3 characters")
			.max(50, "location must be less than 150 characters"),
		initialValue: "",
		startIcon: <HomeOutlined />,
	},
	{
		key: "6",
		label: "Contact Person",
		name: "contactName",
		type: "text",
		validationSchema: Yup.string()
			.required("Contact Person is Required")
			.min(3, "Contact Person must be at least 3 characters")
			.max(50, "Contact Person must be less than 150 characters"),
		initialValue: "",
		startIcon: <Person />,
	},
	{
		key: "8",
		label: "Your Website URL",
		name: "website",
		type: "url",
		validationSchema: Yup.string().matches(url_regex, "URL is not valid"),
		initialValue: "",
		startIcon: <Web />,
	},
	{
		key: "7",
		label: "Your Country",
		name: "country",
		type: "select",
		validationSchema: Yup.string().required("This field is Required"),
		initialValue: "",
		options: countries.map((country) => ({
			key: country.code,
			value: `${country.label}`,
			phone: country.phone,
		})),
		startIcon: <LocationCity />,
	},
];
export default EditProfileSchema;
