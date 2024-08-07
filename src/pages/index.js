import { lazy } from "react";

export const Home = lazy(() => import("./Home"));
export const Login = lazy(() => import("./Login"));
export const Register = lazy(() => import("./UniversityRegister"));
export const StudentRegistration = lazy(() => import("./StudentRegistration"));
export const Dashboard = lazy(() => import("./Dashboard"));
export const Settings = lazy(() => import("./Settings"));
export const ForgotPassword = lazy(() => import("./ForgotPassword"));
export const Universities = lazy(() => import("./Universities"));
export const Contacts = lazy(() => import("./Contacts"));
export const CreditManagement = lazy(() => import("./CreditManagement"));
export const StudentManagement = lazy(() => import("./StudentManagement"));
export const PreviousFairs = lazy(() => import("./PreviousFairs"));
export const Supports = lazy(() => import("./Supports"));
export const Notifications = lazy(() => import("./Notifications"));
export const Users = lazy(() => import("./Users"));
export const AllSchoolFairs = lazy(() => import("./AllSchoolFairs"));
export const RequestedUniversities = lazy(() =>
  import("./RequestedUniversities")
);
export const RequestedExclusiveCredits = lazy(() =>
  import("./RequestedExclusiveCredits")
);
export const RequestedNormalCredits = lazy(() =>
  import("./RequestedNormalCredits")
);
export const SchoolFairRequests = lazy(() => import("./SchoolFairRequests"));
export const Products = lazy(() => import("./Products"));
export const Categories = lazy(() => import("./Categories"));
export const ManageFAQs = lazy(() => import("./ManageFAQs"));
export const Schools = lazy(() => import("./Schools"));
export const FairRequests = lazy(() => import("./FairRequests"));
export const SchoolFairs = lazy(() => import("./SchoolFairs"));
export const CompletedFairs = lazy(() => import("./CompletedFairs"));

//University Lazy Import Export
export const UniversityDashboard = lazy(() => import("./UniversityDashboard"));
export const Credits = lazy(() => import("./Credits"));
export const Leads = lazy(() => import("./Leads"));
export const MyLeads = lazy(() => import("./MyLeads"));
export const ExclusiveLeads = lazy(() => import("./ExclusiveLeads"));
export const UniversitySupport = lazy(() => import("./UniversitySupport"));
export const AddCredit = lazy(() => import("./AddCredit"));
export const SchoolDashboard = lazy(() => import("./SchoolDashboard"));
export const AddNewFair = lazy(() => import("./AddFair"));
export const UniversityFairs = lazy(() => import("./UniversityFairs"));
