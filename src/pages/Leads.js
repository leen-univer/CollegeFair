import { getArrFromObj } from "@ashirbad/js-core";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Add, Cancel } from "@mui/icons-material";
import { Button, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import {
  useIsMounted,
  useNestedSchoolFairs,
  useStudents,
  useUniversities,
} from "hooks";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
// import moment from "moment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { useUniversities } from "hooks";

const Leads = () => {
  const { isMounted } = useIsMounted();
  const [isRegisteredStudentsPanelOpen, setIsRegisteredStudentsPanelOpen] =
    useState(false);
  const [time, setTime] = useState(new Date());
  const timeout = useRef();
  const hasEventStarted = (date, time) => {
    const eventStartTime = new Date(
      moment(`${date} ${time}`).subtract(24, "hours").toDate()
    );
    console.log(date, time);
    const currentTime = new Date();
    return currentTime >= eventStartTime;
  };
  useEffect(() => {
    (() => {
      if (!isMounted.current) return;
      timeout.current = setTimeout(() => setTime(new Date()), 2000);
    })();
    return () => {
      timeout.current && clearTimeout(timeout.current);
      isMounted.current = false;
    };
  }, [time, isMounted]);
  // console.log(new Date(moment(`2022-10-07`).subtract(24, "hours").toDate()));
  console
    .log
    // time >= new Date(moment(`2022-10-07`).subtract(24, "hours").toDate())
    ();
  const { user } = useAppContext();
  console.log("userID", user?.uid);
  const navigate = useNavigate();
  const { universities } = useUniversities();
  const { schoolFairs } = useNestedSchoolFairs();

  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];
  // console.log(SUPERADMIN);
  const { students } = useStudents();
  const { sendNotification, sendMail } = useAppContext();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

  const upcomingEvents = [
    ...students?.filter((item) => {
      const eventStartDate = new Date(item?.date);
      eventStartDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the event day
      return eventStartDate >= currentDate;
    }),
    ...schoolFairs?.filter((item) => {
      const eventStartDate = new Date(item?.date);
      eventStartDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the event day
      return eventStartDate >= currentDate;
    }),
  ]
    .slice()
    .sort((a, b) => new Date(a?.date) - new Date(b?.date));
  // const totalEvents = upcomingEvents?.concat(pastEvents);
  const totalEvents = upcomingEvents;
  console.log(totalEvents);
  // console.log(totalEvents?.length);

  const handleCancel = async (row) => {
    // console.log(row);
    if (!row?.createdBy) return;
    if (row?.createdBy === "school") {
      try {
        await database.ref(`Users/${auth?.currentUser?.uid}`).update({
          creditAmount: +user?.creditAmount + +row?.credits,
          creditUpdatedTime: new Date().toString(),
        });
        await database
          .ref(`CreditTransactions/${auth?.currentUser?.uid}`)
          .push({
            timestamp: new Date().toString(),
            oldAmount: +user?.creditAmount,
            amountAdded: +row?.credits,
            newAmount: +user?.creditAmount + +row?.credits,
            type: "+",
            message: "Credited",
          });

        await database
          .ref(
            `SchoolFairs/${row?._id}/${row?.id}/participationRequest/${auth?.currentUser?.uid}`
          )
          .remove();
        // console.log("hadg");
        if (
          getArrFromObj(row?.AcceptedUniversity).find(
            (item) => item?.uid === auth?.currentUser?.uid
          )
        ) {
          await database
            .ref(
              `SchoolFairs/${row?._id}/${row?.id}/AcceptedUniversity/${auth?.currentUser?.uid}`
            )
            .remove();
        }
        if (
          getArrFromObj(user?.upcomingFairs).find(
            (item) => item?.id === row?.id
          )
        ) {
          // console.log("university remove from upcoming fairs");

          await database
            .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
            .remove();
        }
        Swal.fire({
          text: `Participation Cancelled for fair ${row?.displayName}`,
          icon: "success",
        });
        const notification = {
          title: "Participation Cancelled",
          description: `Participation cancelled By ${user?.displayName} for fair ${row?.displayName}`,
          read: false,
          timestamp: new Date().toString(),
        };

        sendNotification({
          notification: {
            title: `Participation Cancelled `,
            body: `Participation Cancelled by ${user?.displayName} for fair ${row?.displayName}`,
          },
          FCMToken: SUPERADMIN?.fcmToken,
        });
        sendMail({
          to: SUPERADMIN?.email,
          subject: `Participation Request Cancel`,
          html: `Participation Request Cancel by ${user?.displayName} for fair ${row?.displayName}`,
        });
        database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await database.ref(`Users/${auth?.currentUser?.uid}`).update({
          creditAmount: +user?.creditAmount + +row?.credits,
          creditUpdatedTime: new Date().toString(),
        });
        await database
          .ref(`CreditTransactions/${auth?.currentUser?.uid}`)
          .push({
            timestamp: new Date().toString(),
            oldAmount: +user?.creditAmount,
            amountAdded: +row?.credits,
            newAmount: +user?.creditAmount + +row?.credits,
            type: "+",
            message: "Credited",
          });

        await database
          .ref(
            `NewFairs/${row?.id}/participationRequest/${auth?.currentUser?.uid}`
          )
          .remove();
        if (
          getArrFromObj(row?.AcceptedUniversity).find(
            (item) => item?.uid === auth?.currentUser?.uid
          )
        ) {
          await database
            .ref(
              `NewFairs/${row?.id}/AcceptedUniversity/${auth?.currentUser?.uid}`
            )
            .remove();
        }
        if (
          getArrFromObj(user?.upcomingFairs).find(
            (item) => item?.id === row?.id
          )
        ) {
          // console.log("university remove from upcoming fairs");

          await database
            .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
            .remove();
        }
        Swal.fire({
          text: `Participation Cancelled for fair ${row?.displayName}`,
          icon: "success",
        });
        const notification = {
          title: "Participation Cancelled",
          description: `Participation cancelled By ${user?.displayName} for fair ${row?.displayName}`,
          read: false,
          timestamp: new Date().toString(),
        };

        sendNotification({
          notification: {
            title: `Participation Cancelled `,
            body: `Participation Cancelled by ${user?.displayName} for fair ${row?.displayName}`,
          },
          FCMToken: SUPERADMIN?.fcmToken,
        });
        sendMail({
          to: SUPERADMIN?.email,
          subject: `Participation Request Cancel`,
          html: `Participation Request Cancel by ${user?.displayName} for fair ${row?.displayName}`,
        });
        database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleParticipate = async (row) => {
    if (!row?.createdBy) return;
    if (row?.createdBy === "school") {
      if (user?.creditAmount >= +row?.credits) {
        await database
          .ref(`CreditTransactions/${auth?.currentUser?.uid}`)
          .push({
            timestamp: new Date().toString(),
            oldAmount: user?.creditAmount,
            amountDebited: +row?.credits,
            newAmount: user?.creditAmount - +row?.credits,
            type: "-",
            message: "Debited",
          });
        await database
          .ref(`Users/${auth?.currentUser?.uid}/`)
          .update({ creditAmount: user?.creditAmount - +row?.credits });
        await database
          .ref(
            `SchoolFairs/${row?._id}/${row?.id}/AcceptedUniversity/${auth.currentUser.uid}`
          )
          .update({
            displayName: user?.displayName,
            uid: auth?.currentUser.uid,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            location: user?.location,
            country: user?.country,
            website: user?.website,
            timestamp: new Date().toString(),
            isRequested: true,
          });
        await database
          .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
          .update({
            ...row,
            tableData: {},
            timestamp: new Date().toString(),
          });
        Swal.fire({
          text: "You Are In",
          icon: "success",
        });
      } else {
        Swal.fire({
          text: "You Don't have enough Credits",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Buy Now",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/credits");
          }
        });
      }
    } else {
      if (user?.creditAmount >= +row?.credits) {
        await database
          .ref(`CreditTransactions/${auth?.currentUser?.uid}`)
          .push({
            timestamp: new Date().toString(),
            oldAmount: user?.creditAmount,
            amountDebited: +row?.credits,
            newAmount: user?.creditAmount - +row?.credits,
            type: "-",
            message: "Debited",
          });
        await database
          .ref(`Users/${auth?.currentUser?.uid}/`)
          .update({ creditAmount: user?.creditAmount - +row?.credits });
        await database
          .ref(`NewFairs/${row?.id}/AcceptedUniversity/${auth.currentUser.uid}`)
          .update({
            displayName: user?.displayName,
            uid: auth?.currentUser.uid,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            location: user?.location,
            country: user?.country,
            website: user?.website,
            timestamp: new Date().toString(),
            isRequested: true,
          });
        await database
          .ref(`Users/${auth?.currentUser?.uid}/upcomingFairs/${row?.id}`)
          .update({
            ...row,
            timestamp: new Date().toString(),
          });
        Swal.fire({
          text: "You Are In",
          icon: "success",
        });
      } else {
        Swal.fire({
          text: "You Don't have enough Credits",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Buy Now",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/credits");
          }
        });
      }
    }
    // console.log(row);
  };
  // console.log(totalEvents);
  return (
    <section className="py-2">
      <MaterialTable
        data={
          totalEvents
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
            ?.map((item, i) => ({ ...item, sl: i + 1 })) || []
        }
        title="Fairs"
        columns={[
          {
            title: "#",
            field: "sl",
            editable: "never",
            width: "10%",
          },
          {
            title: "Name",
            field: "displayName",
          },

          {
            title: "School System",
            field: "schoolName",
          },
          {
            title: "Number Of Students",
            field: "studentCount",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
          { title: "City", field: "city" },
          {
            title: "Fair Date",
            field: "date",
            render: (rowData) => moment(rowData?.date).format("LL"),
          },
          {
            title: "Start Time",
            field: "time",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
            emptyValue: "--",
          },
          {
            title: "End Time",
            field: "endTime",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
            emptyValue: "--",
          },
          {
            title: "Participation Credits",
            field: "credits",
            headerStyle: {
              textAlign: "center",
            },
            cellStyle: {
              textAlign: "center",
            },
          },
          // {
          // 	title: "Created At",
          // 	searchable: true,
          // 	field: "timestamp",
          // 	render: ({ timestamp }) =>
          // 		moment(timestamp).format("Do MMM YYYY hh:mm A"),
          // 	customSort: (a, b) =>
          // 		new Date(b?.timestamp) - new Date(a?.timestamp),
          // 	filtering: false,
          // 	editable: "never",
          // 	// width: "2%",
          // 	headerStyle: {
          // 		textAlign: "center",
          // 	},
          // 	cellStyle: {
          // 		textAlign: "center",
          // 	},
          // },
          {
            title: "Participate",
            field: "participate",
            render: (rowData) => (
              <>
                {getArrFromObj(rowData?.participationRequest)?.find(
                  (item) => item?.uid === auth?.currentUser.uid
                ) ||
                (getArrFromObj(rowData?.AcceptedUniversity)?.find(
                  (item) => item?.id === auth?.currentUser.uid
                ) &&
                  !rowData?.isBooked) ? (
                  <Button
                    disabled={
                      hasEventStarted(rowData?.date, rowData?.time)

                      // isRegisteredStudentsPanelOpen === rowData?.tableData?.id
                    }
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => handleCancel(rowData)}
                    sx={{
                      px: 1,
                      py: 1,
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    // onClick={() => {
                    // 	setSelectedFair(rowData);
                    // }}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                ) : rowData?.isBooked ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{
                      px: 1,
                      py: 1,
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    // onClick={() => {
                    // 	s0etSelectedFair(rowData);
                    // }}
                    disabled
                  >
                    Fully Booked
                  </Button>
                ) : (
                  !rowData?.isBooked && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      disabled={
                        hasEventStarted(rowData?.date, rowData?.time)
                        // true
                      }
                      sx={{
                        px: 1,
                        py: 1,
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                      // onClick={() => {
                      // 	setSelectedFair(rowData);
                      // }}
                      startIcon={<Add />}
                      onClick={() => handleParticipate(rowData)}
                    >
                      Participate
                    </Button>
                  )
                )}
              </>
            ),
          },
        ]}
        options={{
          filtering: false,
          exportAllData: true,
          detailPanelColumnAlignment: "right",
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
        // actions={[
        // 	{
        // 		icon: "person_add_alt",
        // 		tooltip: <strong>{"Send Request as Normal Leads"}</strong>,
        // 		onClick: (evt, rowData) => handleNormalLeads(rowData),
        // 	},
        // 	{
        // 		icon: "send",
        // 		tooltip: <strong>{"Send Request as Exclusive Leads"}</strong>,
        // 		onClick: (evt, rowData) => handleExclusiveLeads(rowData),
        // 	},
        // 	{
        // 		icon: "edit",
        // 		tooltip: <strong>{"Edit Student"}</strong>,
        // 		onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
        // 	},
        // ]}
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
            render: ({ rowData }) => {
              return (
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
                        (a, b) =>
                          new Date(b?.timestamp) - new Date(a?.timestamp)
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
                        render: ({ id, date, time }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            // Display the actual student id if the event has started
                            id
                          ) : (
                            // Display a skeleton loading if the event has not started yet
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Name",
                        field: "name",
                        searchable: true,
                        render: ({ name }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            name
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Email",
                        field: "email",
                        export: true,
                        searchable: true,
                        render: ({ email }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            email
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Phone",
                        field: "phoneNumber",
                        searchable: true,
                        render: ({ phoneNumber }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            phoneNumber
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Age",
                        field: "age",
                        export: true,
                        render: ({ age }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            age
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Gender",
                        field: "gender",
                        export: true,
                        render: ({ gender }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            gender
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Nationality",
                        field: "nationality",
                        export: true,
                        render: ({ nationality }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            nationality
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Area Of Interest",
                        field: "areaOfInterest",
                        export: true,
                        render: ({ areaOfInterest }) =>
                          Boolean(
                            getArrFromObj(rowData?.AcceptedUniversity)?.find(
                              (item) => item?.uid === auth.currentUser.uid
                            )
                          ) && hasEventStarted(rowData?.date, rowData?.time) ? (
                            areaOfInterest
                          ) : (
                            <Skeleton
                              animation="wave"
                              height={"12px"}
                              width={"80%"}
                            />
                          ),
                      },
                      {
                        title: "Created At",
                        field: "timestamp",
                        editable: "never",
                        emptyValue: "--",
                        render: ({ timestamp }) =>
                          moment(timestamp).format("Do MMM YYYY hh:mm A"),
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
              );
            },
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
