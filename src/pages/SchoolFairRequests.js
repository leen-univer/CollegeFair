import MaterialTable from "@material-table/core";
import { Button, Chip, ListItem, ListItemText } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Card, CardContent, Typography } from "@mui/material";
import { AddStudentDrawer, EditStudentDrawer } from "components/drawer";
import { database } from "configs";
import { useAppContext } from "contexts";
import {
	useNestedRequestFairs,
	useRequestFairs,
	useSchoolFairs,
	useStudents,
} from "hooks";
import moment from "moment";
import { useState } from "react";
import RequestUniversityDrawer from "components/drawer/RequestUniversityDrawer";
// import { useUniversities } from "hooks";
import { getArrFromObj } from "@ashirbad/js-core";
import { Cancel, Done } from "@mui/icons-material";
import { ParticipationCreditDialog } from "components/dialog";
import Swal from "sweetalert2";

const SchoolFairRequests = () => {
	const { user } = useAppContext();
	const [openAddStudentDrawer, setOpenAddStudentDrawer] = useState(false);
	const [openEditStudentDrawer, setOpenEditStudentDrawer] = useState(false);
	const [openRequestUniversityDrawer, setOpenRequestUniversityDrawer] =
		useState(false);
	const { requestFairs } = useNestedRequestFairs();

	const upcomingEvents = requestFairs?.filter(
		(item) => new Date(item?.date) >= new Date()
	);

	// const pastEvents = students
	// 	?.filter((item) => new Date(item?.date) < new Date())
	// 	?.slice()
	// 	?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
	// const totalEvents = upcomingEvents?.concat(pastEvents);
	const { snackBarOpen } = useAppContext();

	const [openDialog, setOpenDialog] = useState(false);
	const handleReject = async (row) => {
		try {
			Swal.fire({
				text: "Are you sure?",
				icon: "warning",
				confirmButtonText: "OK",
			}).then(async (result) => {
				if (result?.isConfirmed) {
					await database.ref(`FairRequests/${row?._id}/${row?.id}`).update({
						isAccepted: "rejected",
					});
					snackBarOpen("Fair Rejected Successfully", "success");
				}
			});
		} catch (error) {
			snackBarOpen(error.message, "error");
			console.log(error);
		}
	};
	return (
		<section className="py-2">
			<ParticipationCreditDialog
				openDialog={openDialog}
				handleClose={() => setOpenDialog(false)}
			/>
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
					?.sort((a, b) => new Date(a?.startDate) - new Date(b?.startDate))
					.map((student, i) => ({ ...student, sl: i + 1 }))}
				title="Fair Requests"
				columns={[
					{
						title: "#",
						field: "sl",
						editable: "never",
						filtering: false,
					},
					{
						title: "School Name",
						searchable: true,
						field: "createdSchoolName",
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
					//   {
					//     title: "Participation Credit",
					//     searchable: true,
					//     field: "credits",
					//     type: "numeric",
					//     emptyValue: "--",
					//     filtering: false,
					//     headerStyle: {
					//       textAlign: "center",
					//     },
					//     cellStyle: {
					//       textAlign: "center",
					//     },
					//   },

					{
						title: "Status",
						render: ({ isAccepted }) =>
							isAccepted === "accepted" ? (
								<>
									<Chip
										label="Accepted"
										color="success"
										size="small"
										variant="outlined"
										icon={<Done />}
									/>
								</>
							) : isAccepted === "rejected" ? (
								<>
									<Chip
										label="Rejected"
										color="error"
										size="small"
										variant="outlined"
										icon={<Cancel />}
									/>
								</>
							) : (
								<Chip
									label="Pending"
									color="info"
									size="small"
									variant="outlined"
									// icon={< />}
								/>
							),
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
					{
						// title: "Status",
						render: (row) => (
							<>
								<div
									style={{
										display: "flex",
										gap: 5,
									}}
								>
									<Button
										color="success"
										variant="contained"
										size="small"
										disabled={row?.isAccepted === "rejected"}
										startIcon={<Done />}
										sx={{
											py: 0.5,
										}}
										onClick={() => setOpenDialog(row)}
									>
										Accept
									</Button>
									<Button
										color="error"
										variant="contained"
										size="small"
										startIcon={<Cancel />}
										onClick={() => handleReject(row)}
										disabled={row?.isAccepted === "rejected"}
									>
										Reject
									</Button>
								</div>
							</>
						),
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
				// editable={{
				//   onRowDelete: async (oldData) => {
				//     try {
				//       await database
				//         .ref(`FairRequests/${oldData?._id}/${oldData?.id}`)

				//       snackBarOpen(
				//         `Fair  ${oldData.displayName} Deleted Successfully`,
				//         "success"
				//       );
				//     } catch (error) {
				//       snackBarOpen(error.message, "error");
				//       console.log(error);
				//     }
				//   },
				// }}
				// actions={[
				//   {
				//     icon: "add",
				//     tooltip: <strong>{"Add New Fair"}</strong>,
				//     isFreeAction: true,
				//     onClick: (evt, rowData) => setOpenAddStudentDrawer(true),
				//   },
				//   {
				//     icon: "edit",
				//     tooltip: <strong>{"Edit Fair"}</strong>,
				//     onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
				//   },
				// ]}
				detailPanel={[
					{
						tooltip: "View Fair Details",
						icon: "info",
						openIcon: "visibility",

						render: ({ rowData }) => (
							<>
								{console.log(rowData)}
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
				]}
				isLoading={!requestFairs}
			/>
			{/* <SendNotification
				selectedUsers={selectedUsers}
				handleClose={() => setSelectedUsers([])}
			/> */}
		</section>
	);
};

export default SchoolFairRequests;
