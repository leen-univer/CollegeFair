import { PanelLayout } from "layouts";
import {
  Categories,
  Dashboard,
  Notifications,
  Products,
  Settings,
  Users,
  ManageFAQs,
  Universities,
  Contacts,
  Supports,
  CreditManagement,
  StudentManagement,
  RequestedUniversities,
  RequestedExclusiveCredits,
  AddCredit,
  PreviousFairs,
  Schools,
  AllSchoolFairs,
  SchoolFairRequests,
} from "pages";
import RequestedNormalCredits from "pages/RequestedNormalCredits";
import RequestEvent from "pages/RequestEvent";
import { Routes, Route } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    <PanelLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account-settings" element={<Settings />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/credit-management" element={<CreditManagement />} />
        <Route path="/student-management" element={<StudentManagement />} />
        <Route path="/previous-fairs" element={<PreviousFairs />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/supports" element={<Supports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users" element={<Users />} />
        <Route
          path="/requested-universities"
          element={<RequestedUniversities />}
        />
        <Route path="/schools" element={<Schools />} />

        <Route path="/requested-event" element={<RequestEvent />} />
        <Route path="/add-credits" element={<AddCredit />} />
        <Route
          path="/requested-normal-leads"
          element={<RequestedNormalCredits />}
        />
        <Route
          path="/requested-exclusive-leads"
          element={<RequestedExclusiveCredits />}
        />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/manage-faqs" element={<ManageFAQs />} />
        <Route path="/school-fairs" element={<AllSchoolFairs />} />
        <Route path="/school-fair-requests" element={<SchoolFairRequests />} />
      </Routes>
    </PanelLayout>
  );
};

export default PrivateRoutes;
