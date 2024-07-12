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
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import { useStudents } from "hooks";
// import { useAppContext } from "contexts";

import moment from "moment";

const PreviousFairs = () => {
	const { students } = useStudents();
	const { user, snackBarOpen } = useAppContext();
	const pastEvents = students
		?.filter((item) => new Date(item?.date) < new Date())
		?.slice()
		?.sort((a, b) => new Date(b?.date) - new Date(a?.date));
	const ExclusiveLeads = students.filter((student) =>
		getArrFromObj(student?.exclusiveTo).find(
			(item) => item.uid === auth.currentUser.uid
		)
	);
	const exclusiveLeads = ExclusiveLeads.sort(
		(a, b) =>
			new Date(b?.exclusiveTo?.[auth?.currentUser?.uid]?.timestamp) -
			new Date(a?.exclusiveTo?.[auth?.currentUser?.uid]?.timestamp)
	);
	return (
		<section className="py-2">
			<MaterialTable
				isLoading={!pastEvents}
				data={
					pastEvents?.map((item, i) => ({
						...item,
						sl: i + 1,
						fairDate: moment(item?.date).format("LL"),
					})) || []
				}
				title="Previous Fairs"
				columns={[
					{
						title: "#",
						field: "sl",
						editable: "never",
					},
					{
						title: "Name",
						field: "displayName",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{
						title: "City",
						field: "city",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},
					{ title: "Email", field: "email", hidden: true, export: true },
					{
						title: "School System",
						field: "schoolName",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
					},

					{
						title: "Fair Date",
						field: "fairDate",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
						// render: (row) => {
						// 	moment(row?.date).format("LL");
						// },
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
						title: "Number Of Students",
						field: "studentCount",
						headerStyle: {
							textAlign: "center",
						},
						cellStyle: {
							textAlign: "center",
						},
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
				]}
				options={{
					detailPanelColumnAlignment: "right",
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
				// actions={[
				//   {
				//     icon: "visibility",
				//     tooltip: <strong>{"send Request as Normal Leads"}</strong>,
				//     onClick: (evt, rowData) => handleNormalLeads(rowData),
				//   },
				//   {
				//     icon: "send",
				//     tooltip: <strong>{"send Request as Exclusive Leads"}</strong>,
				//     onClick: (evt, rowData) => handleExclusiveLeads(rowData),
				//   },
				//   // {
				//   //   icon: "edit",
				//   //   tooltip: <strong>{"Edit Student"}</strong>,
				//   //   onClick: (evt, rowData) => setOpenEditStudentDrawer(rowData),
				//   // },
				// ]}
				// detailPanel={({ rowData }) => {
				// 	return (
				// 		<div
				// 			style={{
				// 				padding: "20px",
				// 				margin: "auto",
				// 				backgroundColor: "#eef5f9",
				// 			}}
				// 		>
				// 			<Card
				// 				sx={{
				// 					minWidth: 400,
				// 					maxWidth: 450,
				// 					transition: "0.3s",
				// 					margin: "auto",
				// 					borderRadius: "10px",
				// 					boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
				// 					"&:hover": {
				// 						boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
				// 					},
				// 				}}
				// 			>
				// 				<CardContent>
				// 					<Typography variant="h6" gutterBottom align="left">
				// 						Location Link:{" "}
				// 						<a
				// 							href={`${rowData?.link}`}
				// 							style={{ textDecoration: "none", fontSize: "1rem" }}
				// 							target="_blank"
				// 							rel="noreferrer"
				// 						>
				// 							{rowData?.link}{" "}
				// 						</a>
				// 					</Typography>
				// 					<Typography variant="h6" gutterBottom align="left">
				// 						Notes:
				// 						<span
				// 							style={{
				// 								color: "rgb(30, 136, 229)",
				// 								fontSize: "15px",
				// 								wordBreak: "break-word",
				// 								wordWrap: "break-word",
				// 							}}
				// 						>
				// 							{" "}
				// 							{rowData?.notes}{" "}
				// 						</span>
				// 					</Typography>
				// 				</CardContent>
				// 			</Card>
				// 		</div>
				// 	);
				// }}
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
												{/* <a
                          href={rowData?.regLink}
                          style={{ textDecoration: "none", fontSize: "1rem" }}
                          target="_blank"
                          rel="noreferrer"
                        > */}
												{rowData?.regLink || " Not Provided"}
												{/* </a> */}
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
			/>
			{/* <SendNotification
        selectedUsers={selectedUsers}
        handleClose={() => setSelectedUsers([])}
      /> */}
		</section>
	);
};

export default PreviousFairs;
