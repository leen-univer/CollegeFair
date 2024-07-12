import { PanelLayout } from "layouts";
import {
	Credits,
	ExclusiveLeads,
	Leads,
	MyLeads,
	Notifications,
	Settings,
	UniversityDashboard,
	UniversitySupport,
	UniversityFairs,
} from "pages";
import { Routes, Route } from "react-router-dom";
import UpcomingFairs from "./UpcomingFairs";
import PreviousFairs from "./PreviousFairs";
const UniversityRoutes = () => {
	return (
		<PanelLayout>
			<Routes>
				<Route path="/" element={<UniversityDashboard />} />
				<Route path="/dashboard" element={<UniversityDashboard />} />
				<Route path="/account-settings" element={<Settings />} />
				<Route path="/notifications" element={<Notifications />} />
				<Route path="/leads" element={<Leads />} />
				<Route path="/normal-leads" element={<MyLeads />} />
				<Route path="/exclusive-leads" element={<ExclusiveLeads />} />
				<Route path="/upcoming-fairs" element={<UpcomingFairs />} />
				<Route path="/previous-fairs" element={<PreviousFairs />} />
				<Route path="/credits" element={<Credits />} />
				<Route path="/university-support" element={<UniversitySupport />} />
				<Route path="/university-fairs" element={<UniversityFairs />} />
			</Routes>
		</PanelLayout>
	);
};

export default UniversityRoutes;
