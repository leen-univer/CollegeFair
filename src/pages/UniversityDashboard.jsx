import { getArrFromObj } from "@ashirbad/js-core";
import {
  CreditScore,
  Upcoming,
  AssignmentTurnedIn,
  Event,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { Card as DashboardCard } from "components/dashboard";
import { auth } from "configs";
import { useAppContext } from "contexts";
import { useNestedSchoolFairs, useStudents } from "hooks";

const UniversityDashboard = () => {
  const { user } = useAppContext();
  const { students } = useStudents();
  // const { universities } = useUniversities();
  const { schoolFairs } = useNestedSchoolFairs();

  // const upcomingEvents = students?.filter(
  // 	(item) => new Date(item?.date) >= new Date()
  // );
  const pastEvents = students
    ?.filter((item) => new Date(item?.date) < new Date())
    ?.slice()
    ?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
  // const totalEvents = upcomingEvents?.concat(pastEvents);
  const upcomingEvents = [
    ...students?.filter((item) => new Date(item?.date) >= new Date()),
    ...schoolFairs?.filter((item) => new Date(item?.date) >= new Date()),
  ];
  const totalEvents = upcomingEvents;
  // console.log(totalEvents?.length);

  // const unreadMessage = notifications.filter(
  // 	(notification) => notification.read === false
  // );
  const attendedEvents = [
    ...students?.filter((item) => new Date(item?.date) <= new Date()),
    ...schoolFairs?.filter((item) => new Date(item?.date) <= new Date()),
  ];
  // console.log(attendedEvents?.filter(fair=>{
  //   return fair?.AcceptedUniversity[auth?.currentUser?.uid]
  // }))



// Assuming fairs is your array of fairs
const filteredFairs = attendedEvents?.filter(fair => {
  // Check if the current user's UID matches one of the university UIDs in AcceptedUniversity
  return  fair?.AcceptedUniversity?.[auth?.currentUser?.uid]
});


  return (
    <>
      <section className="py-2">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={totalEvents?.length || "00"}
              subtitle="Univer Fairs"
              icon={<Event />}
              onClick={"/leads"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={
                getArrFromObj(user?.upcomingFairs)?.filter(
                  (item) => new Date(item?.date) >= new Date()
                )?.length || "00"
              }
              subtitle="Your Upcoming Fairs"
              icon={<Upcoming />}
              onClick={"/upcoming-fairs"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={user?.creditAmount || "00"}
              subtitle="Remaining Credits"
              icon={<CreditScore />}
              onClick={"/credits"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={
                filteredFairs?.length || "00"
              }
              subtitle="Attended Fairs"
              icon={<AssignmentTurnedIn />}
              onClick={"/exclusive-leads"}
            />
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default UniversityDashboard;
