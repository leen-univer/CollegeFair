import { getArrFromObj } from "@ashirbad/js-core";
import {
  AccountBalance,
  ContactMail,
  Download,
  NotificationsTwoTone,
  People,
  Person,
  School,
} from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { Card as DashboardCard } from "components/dashboard";
import {
  useContacts,
  useNestedSchoolFairs,
  useNotifications,
  useStudents,
  useUniversities,
} from "hooks";
import moment from "moment";
import { CSVLink } from "react-csv";
// import ApexCharts from "react-apexcharts";
const Dashboard = () => {
  const { universities } = useUniversities();
  const { contacts } = useContacts();
  const { students } = useStudents();
  const { notifications } = useNotifications();
  const unreadMessage = notifications.filter(
    (notification) => notification.read === false
  );
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );
  const { schoolFairs } = useNestedSchoolFairs();
  const upcomingSchoolEvent = schoolFairs?.filter(
    (item) => new Date(item?.date) >= new Date()
  );
  const upcomingEvents = students?.filter(
    (item) => new Date(item?.date) >= new Date()
  );

  //   console.log(
  //     schoolFairs
  //       ?.filter((student) => student?.students)
  //       ?.flatMap((student) => getArrFromObj(student?.students))?.length

  //   );
  const headers = [
    { label: "Fair Name", key: "fairName" },
    { label: "Student Id", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Nationality", key: "nationality" },
    { label: "Area Of Interest", key: "areaOfInterest" },
    { label: "Timestamp", key: "timestamp" },
  ];
  return (
    <>
      {/* <Card>
        <CardHeader
          title="Hello, Super Admin!"
          subheader="Check the latest banking stats under this beautiful dashboard!"
        />
      </Card> */}
      <section className="py-2">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={Universities?.length || "00"}
              subtitle="Universities"
              icon={<AccountBalance />}
              onClick={"/universities"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={contacts?.length || "00"}
              subtitle="Contacts"
              icon={<ContactMail />}
              onClick={"/contacts"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={
                upcomingEvents?.length + upcomingSchoolEvent?.length || "00"
              }
              subtitle="Events"
              icon={<Person />}
              onClick={"/student-management"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={
                universities?.filter((item) => item?.role === "school")
                  ?.length || "00"
              }
              subtitle="Schools"
              icon={<School />}
              onClick={"/schools"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <DashboardCard
              title={
                students
                  ?.filter((student) => student?.students)
                  ?.flatMap((student) => getArrFromObj(student?.students))
                  ?.length +
                  schoolFairs
                    ?.filter((student) => student?.students)
                    ?.flatMap((student) => getArrFromObj(student?.students))
                    ?.length || "00"
              }
              subtitle="Registered students"
              icon={<People />}
              onClick={"/student-management"}
            />
            <CSVLink
              filename="registered-student.csv"
              headers={headers}
              data={
                ([
                  ...students
                    ?.filter((student) => student?.students)
                    ?.flatMap((student) => getArrFromObj(student?.students)),
                  ...schoolFairs
                    ?.filter((student) => student?.students)
                    ?.flatMap((student) => getArrFromObj(student?.students)),
                ]?.length &&
                  [
                    ...students
                      ?.filter((fair) => fair?.students)
                      ?.flatMap((fair) =>
                        getArrFromObj({ ...fair?.students })?.map((item) => ({
                          ...item,
                          fairName: fair?.displayName,
                        }))
                      ),
                    ...schoolFairs
                      ?.filter((student) => student?.students)
                      ?.flatMap((fair) =>
                        getArrFromObj({ ...fair?.students })?.map((item) => ({
                          ...item,
                          fairName: fair?.displayName,
                        }))
                      ),
                  ]?.map((student) => {
                    return {
                      ...student,
                      Name: student?.name,
                      timestamp: moment(student?.timestamp).format("LLL"),
                    };
                  })) ||
                []
              }
            >
              <Button
                className="!bg-theme"
                sx={{
                  marginTop: "10px",
                }}
                startIcon={<Download />}
                variant="contained"
              >
                Download Registered Student
              </Button>
            </CSVLink>
          </Grid>
        </Grid>
      </section>
    </>
  );
};

export default Dashboard;
