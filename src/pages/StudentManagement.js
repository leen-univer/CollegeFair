import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import {
  Card,
  CardContent,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { AddStudentDrawer, EditStudentDrawer } from "components/drawer";
import RequestUniversityDrawer from "components/drawer/RequestUniversityDrawer";
import { database } from "configs";
import { useAppContext } from "contexts";
import { useStudents, useUniversities } from "hooks";
import moment from "moment";
import { useState } from "react";

const Leads = () => {
  const [openAddStudentDrawer, setOpenAddStudentDrawer] = useState(false);
  const [openEditStudentDrawer, setOpenEditStudentDrawer] = useState(false);
  const [openRequestUniversityDrawer, setOpenRequestUniversityDrawer] =
    useState(false);
  const { students } = useStudents();

  const upcomingEvents = students?.filter(
    (item) => new Date(item?.date) >= new Date()
  );
  console.log(upcomingEvents?.length);
  // const pastEvents = students
  // 	?.filter((item) => new Date(item?.date) < new Date())
  // 	?.slice()
  // 	?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
  // const totalEvents = upcomingEvents?.concat(pastEvents);
  const { snackBarOpen } = useAppContext();
  const { sendNotification, sendMail } = useAppContext();

  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );
  console.log(
    upcomingEvents
      ?.map((student, i) => ({
        ...student,
        startDate: new Date(
          new Date(student?.date).getFullYear(),
          new Date(student?.date).getMonth(),
          new Date(student?.date).getDate(),
          +student?.time?.split(":")[0],
          +student?.time?.split(":")[1]
        ),
        endDate: new Date(
          new Date(student?.date).getFullYear(),
          new Date(student?.date).getMonth(),
          new Date(student?.date).getDate(),
          +student?.endTime?.split(":")[0],
          +student?.endTime?.split(":")[1]
        ),
      }))
      .slice()
      ?.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        } else {
          // If dates are equal, compare the times
          const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
          const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
          return timeA - timeB;
        }
      })
      ?.map((student, i) => ({ ...student, sl: i + 1 }))
  );
  return (
    <section className="py-2">
      <RequestUniversityDrawer
        open={openRequestUniversityDrawer}
        setOpenRequestUniversityDrawer={setOpenRequestUniversityDrawer}
      />
      <AddStudentDrawer
        open={openAddStudentDrawer}
        setOpenAddStudentDrawer={setOpenAddStudentDrawer}
      />
      <EditStudentDrawer
        open={openEditStudentDrawer}
        setOpenEditStudentDrawer={setOpenEditStudentDrawer}
      />
      <MaterialTable
        data={upcomingEvents
          ?.map((student, i) => ({
            ...student,
            startDate: new Date(
              new Date(student?.date).getFullYear(),
              new Date(student?.date).getMonth(),
              new Date(student?.date).getDate(),
              +student?.time?.split(":")[0],
              +student?.time?.split(":")[1]
            ),
            endDate: new Date(
              new Date(student?.date).getFullYear(),
              new Date(student?.date).getMonth(),
              new Date(student?.date).getDate(),
              +student?.endTime?.split(":")[0],
              +student?.endTime?.split(":")[1]
            ),
          }))
          .slice()
          ?.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA < dateB) {
              return -1;
            } else if (dateA > dateB) {
              return 1;
            } else {
              // If dates are equal, compare the times
              const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
              const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
              return timeA - timeB;
            }
          })
          ?.map((student, i) => ({ ...student, sl: i + 1 }))}
        title="Fairs"
        columns={[
          {
            title: "#",
            field: "sl",
            editable: "never",
            filtering: false,
          },
          {
            title: "Name",
            searchable: true,
            field: "displayName",
            filtering: false,
          },
          {
            title: "City",
            searchable: true,
            field: "city",
          },

          {
            title: "School System",
            field: "schoolName",
            searchable: true,
            filtering: false,
          },
          {
            title: "Fair Date",
            searchable: true,
            field: "date",
            filtering: false,
            editable: "never",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
            render: (rowData) => moment(rowData?.date).format("LL"),
          },
          { title: "Start Time", field: "time", emptyValue: "--" },
          {
            title: "End Time",
            field: "endTime",
            // headerStyle: {
            //   textAlign: "center",
            // },
            // cellStyle: {
            //   textAlign: "center",
            // },
            emptyValue: "--",
          },
          {
            title: "Number of Students",
            searchable: true,
            field: "studentCount",
            type: "numeric",
            filtering: false,
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
          {
            title: "Participation Credit",
            searchable: true,
            field: "credits",
            type: "numeric",
            filtering: false,
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
          {
            title: "Created At",
            searchable: true,
            field: "timestamp",
            render: ({ timestamp }) =>
              moment(timestamp).format("Do MMM YYYY hh:mm A"),
            customSort: (a, b) =>
              new Date(b?.timestamp) - new Date(a?.timestamp),
            filtering: false,
            editable: "never",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
          // {
          //   title: "Universities",
          //   headerStyle: {
          //     textAlign: "center",
          //   },
          //   cellStyle: { textAlign: "center" },
          //   render: (rowData) => (
          //     <Tooltip title="Participated Universities">
          //       <IconButton color="primary">
          //         <School
          //           fontSize="large"
          //           onClick={() => setOpenRequestUniversityDrawer(rowData)}
          //         />
          //       </IconButton>
          //     </Tooltip>
          //   ),
          // },
        ]}
        options={{
          detailPanelColumnAlignment: "right",
          filtering: false,
          sorting: true,
          exportAllData: true,
          exportMenu: [
            {
              label: "Export Users Data In CSV",
              exportFunc: (cols, data) => ExportCsv(cols, data),
            },
            {
              label: "Export Users Data In PDF",
              exportFunc: (cols, data) => ExportPdf(cols, data),
            },
          ],
          // selection: true,
          actionsColumnIndex: -1,
        }}
        style={{
          boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
          borderRadius: "8px",
        }}
        editable={{
          onRowDelete: async (oldData) => {
            try {
              const usersRef = database.ref("Users");

              // Fetch all users from the database.
              const snapshot = await usersRef.once("value");
              const usersData = snapshot.val();

              // Loop through each user and check if the fairId exists in their upcoming fairs.
              for (const uid in usersData) {
                const user = usersData[uid];

                if (user.upcomingFairs && user.upcomingFairs[oldData?.id]) {
                  // If the fairId exists in the user's upcoming fairs, remove it.
                  await usersRef
                    .child(`${uid}/upcomingFairs/${oldData?.id}`)
                    .remove();
                }
              }
              await database.ref(`NewFairs/${oldData.id}`).remove();
              const notification = {
                title: "Fair Deleted",
                description: `Fair ${oldData.displayName} Deleted By SuperAdmin`,
                read: false,
                timestamp: new Date().toString(),
              };
              Universities?.forEach(async (item) => {
                return (
                  sendNotification({
                    notification: {
                      title: `Fair Deleted`,
                      body: `Fair ${oldData.displayName} Deleted By SuperAdmin`,
                    },
                    FCMToken: item?.fcmToken,
                  }),
                  sendMail({
                    to: item?.email,
                    subject: "College Fair Cancelled",
                    html: `
													<p>
													We have got an important update for you! The below college fair has been cancelled<br/>
													<br/>
													Fair Name: <strong>${oldData.displayName}</strong> <br/>
													Fair Date: <strong> ${moment(oldData?.date).format("LL")}</strong><br/> 
													<br/>             
													We apologize for the inconvenience, please get in touch with us if you have any questions.<br/> 
													<br/>
													Univer Team
													</p>
													`,
                  }),
                  database.ref(`Notifications/${item?.uid}`).push(notification)
                );
              });

              // snackBarOpen("Student Data updated Successfully", "success");
              snackBarOpen(
                `Fair  ${oldData.displayName} Deleted Successfully`,
                "success"
              );
            } catch (error) {
              snackBarOpen(error.message, "error");
              console.log(error);
            }
          },
        }}
        actions={[
          {
            icon: "add",
            tooltip: <strong>{"Add New Fair"}</strong>,
            isFreeAction: true,
            onClick: (evt, rowData) => setOpenAddStudentDrawer(true),
          },
          {
            icon: "edit",
            tooltip: <strong>{"Edit Fair"}</strong>,
            onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
          },
        ]}
        detailPanel={[
          {
            tooltip: "View Fair Details",
            icon: "info",
            openIcon: "visibility",

            render: ({ rowData }) => (
              <>
                <div
                  style={{
                    padding: "2px",
                    margin: "auto",
                    backgroundColor: "#eef5f9",
                  }}
                >
                  <Card
                    sx={{
                      minWidth: 950,
                      maxWidth: 950,
                      transition: "0.3s",
                      margin: "auto",
                      borderRadius: "10px",
                      // fontFamily: italic,
                      boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                      "&:hover": {
                        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom align="left">
                        Registration Link:
                        <a
                          href={rowData?.regLink}
                          style={{ textDecoration: "none", fontSize: "1rem" }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {rowData?.regLink}
                        </a>
                      </Typography>
                      <Typography variant="h6" gutterBottom align="left">
                        Location Link:
                        <a
                          href={rowData?.link}
                          style={{ textDecoration: "none", fontSize: "1rem" }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {rowData?.link}
                        </a>
                      </Typography>
                      <Typography variant="h6" gutterBottom align="left">
                        Notes:
                        <span
                          style={{
                            color: "rgb(30, 136, 229)",
                            fontSize: "15px",
                            wordBreak: "break-word",
                            wordWrap: "break-word",
                          }}
                        >
                          {" "}
                          {rowData?.notes}{" "}
                        </span>
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </>
            ),
          },
          {
            icon: "person",
            openIcon: "visibility",
            tooltip: "View Registered Students",
            render: ({ rowData }) => (
              <div
                style={{
                  padding: "4vh",
                  margin: "auto",
                  backgroundColor: "#eef5f9",
                }}
              >
                <MaterialTable
                  data={getArrFromObj(rowData?.students)
                    ?.sort(
                      (a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
                    )
                    .map((item, i) => ({ ...item, sl: i + 1 }))}
                  title="Registered Students"
                  columns={[
                    {
                      title: "#",
                      field: "sl",
                      width: "2%",
                    },
                    {
                      title: "Student Id",
                      searchable: true,
                      field: "id",
                      filtering: false,
                    },
                    {
                      title: "Name",
                      field: "name",
                      searchable: true,
                    },
                    {
                      title: "Email",
                      field: "email",
                      export: true,
                      searchable: true,
                    },
                    { title: "Phone", field: "phoneNumber", searchable: true },
                    {
                      title: "Age",
                      field: "age",
                      export: true,
                      searchable: true,
                    },
                    {
                      title: "Gender",
                      field: "gender",
                      export: true,
                      searchable: true,
                    },
                    {
                      title: "Nationality",
                      field: "nationality",
                      export: true,
                      searchable: true,
                    },
                    {
                      title: "Area Of Interest",
                      field: "areaOfInterest",
                      export: true,
                      searchable: true,
                    },
                    {
                      title: "Created At",
                      editable: "never",
                      field: "timestamp",
                      filtering: false,
                      render: ({ timestamp }) =>
                        moment(new Date(timestamp)).format("lll"),
                    },
                  ]}
                  options={{
                    detailPanelColumnAlignment: "right",
                    exportAllData: true,
                    selection: false,
                    exportMenu: [
                      {
                        label: "Export Users Data In CSV",
                        exportFunc: (cols, data) => ExportCsv(cols, data),
                      },
                      {
                        label: "Export Users Data In PDF",
                        exportFunc: (cols, data) => ExportPdf(cols, data),
                      },
                    ],
                    // selection: true,
                    actionsColumnIndex: -1,
                  }}
                  style={{
                    boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ),
          },
          {
            icon: "school",
            openIcon: "visibility",
            tooltip: "View Participated Universities",
            render: ({ rowData }) => (
              <div
                style={{
                  padding: "4vh",
                  margin: "auto",
                  backgroundColor: "#eef5f9",
                }}
              >
                <MaterialTable
                  data={getArrFromObj(rowData?.AcceptedUniversity)
                    ?.sort(
                      (a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
                    )
                    .map((item, i) => ({ ...item, sl: i + 1 }))}
                  title="Universities"
                  columns={[
                    {
                      title: "#",
                      field: "sl",
                      width: "2%",
                    },
                    {
                      title: "University Name",
                      field: "displayName",
                      searchable: true,
                      render: ({ displayName, email, picture }) => (
                        <>
                          <ListItem>
                            <ListItemText
                              primary={displayName}
                              // secondary={`${email}`}
                            />
                          </ListItem>
                        </>
                      ),
                    },
                    {
                      title: "Email",
                      field: "email",
                      export: true,
                      searchable: true,
                    },
                    { title: "Phone", field: "phoneNumber", searchable: true },
                    {
                      title: "Contact Person",
                      field: "contactName",
                      hidden: true,
                      export: true,
                    },
                    {
                      title: "Location",
                      field: "location",
                      searchable: true,
                      // hidden: true,
                      export: true,
                    },
                    // {
                    //   title: "Country",
                    //   field: "country",
                    //   searchable: true,
                    //   // hidden: true,
                    //   export: true,
                    // },
                  ]}
                  options={{
                    detailPanelColumnAlignment: "right",
                    exportAllData: true,
                    selection: false,
                    exportMenu: [
                      {
                        label: "Export Users Data In CSV",
                        exportFunc: (cols, data) => ExportCsv(cols, data),
                      },
                      {
                        label: "Export Users Data In PDF",
                        exportFunc: (cols, data) => ExportPdf(cols, data),
                      },
                    ],
                    // selection: true,
                    actionsColumnIndex: -1,
                  }}
                  style={{
                    boxShadow: "#6a1b9a3d 0px 8px 16px 0px",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ),
          },
        ]}
        isLoading={!students}
      />
      {/* <SendNotification
				selectedUsers={selectedUsers}
				handleClose={() => setSelectedUsers([])}
			/> */}
    </section>
  );
};

export default Leads;
