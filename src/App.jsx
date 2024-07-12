import { ThemeProvider } from "@mui/material";
import { Loader } from "components/core";
import { SnackBarPortal } from "components/portal";
import { useAppContext } from "contexts";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { PrivateRoutes, PublicRoutes, UniversityRoutes } from "routers";
import SchoolRoutes from "routers/SchoolRoutes";
import useCustomTheme from "theme";
const App = () => {
  const { user, loader } = useAppContext();

  const { theme } = useCustomTheme();
  const renderByRole = () => {
    switch (user?.role) {
      case "superadmin":
        return <PrivateRoutes />;
      case "university":
        return <UniversityRoutes />;
      case "school":
        return <SchoolRoutes />;
      default:
        return <PublicRoutes />;
    }
  };

  // if (window.location.host === "univerleads.me")
  // return (
  //   <div className="content-area">
  //     <div>
  //       <img
  //         src="https://univer.me/front-end/images/UNIVER41.png"
  //         alt=""
  //         className="logo fade-in one"
  //       />
  //       <h3 className="fade-in two">Univer Leads - Coming Soon</h3>
  //     </div>
  //   </div>
  // );

  return (
    <>
      <Suspense fallback={<Loader />}>
        <ThemeProvider theme={theme}>
          {!loader ? (
            <BrowserRouter>{renderByRole()}</BrowserRouter>
          ) : (
            <Loader />
          )}
        </ThemeProvider>
      </Suspense>
      <SnackBarPortal />
    </>
  );
};

export default App;
