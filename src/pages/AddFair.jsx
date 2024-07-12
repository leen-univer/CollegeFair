import {
  Container,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
// import { Fragment } from "react";
import { AddSchoolFairSchema } from "schemas";
import { Done } from "@mui/icons-material";
import { database } from "configs";
import { useAppContext } from "contexts";
import { LoadingButton } from "@mui/lab";
import { useSchoolFairs, useUniversities } from "hooks";
import moment from "moment";
import Swal from "sweetalert2";

const AddFair = ({ open, setOpenAddStudentDrawer }) => {
  const { user } = useAppContext();
  console.log(user);
  // console.log(user);
  const { snackBarOpen } = useAppContext();
  const { sendNotification, sendMail } = useAppContext();
  const { schoolFairs } = useSchoolFairs();
  const upcomingEvents = schoolFairs
    ?.filter((item) => new Date(item?.date) >= new Date())
    .map((student, i) => ({
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
    ?.sort((a, b) => new Date(a?.startDate) - new Date(b?.startDate));
  // const drawerData = open;
  // console.log(drawerData);
  // console.log(open);
  console.log(
    new Date() <=
      new Date(
        new Date(upcomingEvents[0]?.startDate.getTime()) - 1 * 60 * 60 * 1000
      )
  );

  const { universities } = useUniversities();
  const Universities = universities.filter(
    (university) => university?.role === "university"
  );

  // console.log(Universities);

  const initialValues = AddSchoolFairSchema?.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = AddSchoolFairSchema?.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleSend = async (values, submitProps) => {
    // console.log(values);
    try {
      const startDate = new Date(
        new Date(values?.date).getFullYear(),
        new Date(values?.date).getMonth(),
        new Date(values?.date).getDate(),
        +values?.time?.split(":")[0],
        +values?.time?.split(":")[1]
      );
      const endDate = new Date(
        new Date(values?.date).getFullYear(),
        new Date(values?.date).getMonth(),
        new Date(values?.date).getDate(),
        +values?.endTime?.split(":")[0],
        +values?.endTime?.split(":")[1]
      );

      // console.log({ startDate });
      // console.log({ endDate });
      // console.log(
      //   new Date(
      //     new Date(upcomingEvents[0]?.startDate.getTime()) - 1 * 60 * 60 * 1000
      //   )
      // );
      // console.log(
      //   new Date(
      //     new Date(upcomingEvents[0]?.endDate.getTime()) + 1 * 60 * 60 * 1000
      //   )
      // );

      if (
        moment(startDate).isBetween(
          moment(
            new Date(
              new Date(upcomingEvents[0]?.startDate.getTime()) -
                1 * 60 * 60 * 1000
            )
          ),
          moment(
            new Date(
              new Date(upcomingEvents[0]?.endDate.getTime()) +
                1 * 60 * 60 * 1000
            )
          )
        ) ||
        moment(startDate).isBetween(
          moment(
            new Date(
              new Date(upcomingEvents[0]?.startDate.getTime()) -
                1 * 60 * 60 * 1000
            )
          ),
          moment(
            new Date(
              new Date(upcomingEvents[0]?.endDate.getTime()) +
                1 * 60 * 60 * 1000
            )
          )
        ) ||
        (moment(endDate).isAfter(
          moment(
            new Date(
              new Date(upcomingEvents[0]?.endDate.getTime()) +
                1 * 60 * 60 * 1000
            )
          )
        ) &&
          moment(startDate).isBefore(
            moment(
              new Date(
                new Date(upcomingEvents[0]?.endDate.getTime()) +
                  1 * 60 * 60 * 1000
              )
            )
          ))

        // startDate <
        // 	new Date(
        // 		new Date(upcomingEvents[0]?.startDate.getTime()) -
        // 			1 * 60 * 60 * 1000
        // 	) ||
        // endDate <
        // 	new Date(
        // 		new Date(upcomingEvents[0]?.endDate.getTime()) +
        // 			1 * 60 * 60 * 1000
        // 	)
      )
        return snackBarOpen(
          "Add fairs in 1 hour gap before and after of previous fair",
          "warning"
        );
      // Swal.fire({
      //   icon: "warning",
      //   text: "Add fairs in 1 hour gap before and after of previous fair",
      // });
      const timestamp = new Date();
      const schoolId = timestamp.getTime();
      const regLink = `${window?.location?.origin}/${user?.displayName}/${values?.displayName}/${user?.uid}/${schoolId}`;
      await database.ref(`FairRequests/${user?.uid}/${schoolId}`).set({
        ...values,
        // startDate,
        // endDate,
        createdSchoolName: user?.displayName,
        isAccepted: false,
        createdBy: user?.role,
        contactName: user?.contactName,
        timestamp: new Date().toString(),
        regLink: regLink,
      });

      // console.log({
      // 	date: values.date,
      // 	time: values.time,
      // 	startDate,
      // 	endDate,
      // 	values,
      // });
      Swal.fire({
        title: "Success!",
        text: "Thank you, you will be notified by email when the fair is approved by Univer Team",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Okay!",
      });
      //   snackBarOpen(`Fair ${values.displayName} added Successfully`, "success");
      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      console.log(error);
    } finally {
      submitProps.setSubmitting(false);
    }
  };

  return (
    <>
      <Container
        style={{
          width: "50vw",
          marginTop: "2vh",
        }}
      >
        <Typography align="center" color="text.primary" variant="h5">
          Add New Fair
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(validationSchema)}
          onSubmit={handleSend}
        >
          {(formik) => (
            <Form>
              <Grid container justifyContent="center">
                {AddSchoolFairSchema?.map((inputItem) => (
                  <Grid item key={inputItem.key} xs={12} sm={12}>
                    <Field name={inputItem.name} key={inputItem.key}>
                      {(props) => {
                        if (inputItem.type === "select") {
                          return (
                            <FormControl
                              required
                              fullWidth
                              margin="normal"
                              variant="outlined"
                              error={Boolean(
                                props.meta.touched && props.meta.error
                              )}
                            >
                              <InputLabel id={`label-${inputItem.name}`}>
                                {inputItem.label}
                              </InputLabel>
                              <Select
                                labelId={`label-${inputItem.name}`}
                                id={inputItem.name}
                                label={inputItem.label}
                                {...props.field}
                              >
                                {inputItem.options.map((option) => (
                                  <MenuItem
                                    value={option.value}
                                    key={option.key}
                                  >
                                    {option?.phone && (
                                      <img
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${option.key.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.key.toLowerCase()}.png 2x`}
                                        alt=""
                                        style={{ margin: "0 1vw" }}
                                      />
                                    )}

                                    {option?.phone ? (
                                      <>{`${option.value} (${option.key}) +${option.phone} `}</>
                                    ) : (
                                      option.value
                                    )}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {props.meta.touched && props.meta.error}
                              </FormHelperText>
                            </FormControl>
                          );
                        }
                        return (
                          <div>
                            <TextField
                              variant="outlined"
                              placeholder={inputItem.placeholder}
                              fullWidth
                              margin="normal"
                              label={inputItem.label}
                              type={inputItem.type}
                              multiline={inputItem?.multiline}
                              rows={inputItem?.rows}
                              error={Boolean(
                                props.meta.touched && props.meta.error
                              )}
                              inputProps={{
                                min: inputItem?.min,
                              }}
                              helperText={
                                props.meta.touched && props.meta.error
                              }
                              {...props.field}
                              InputLabelProps={{ shrink: true }}
                            />
                          </div>
                        );
                      }}
                    </Field>
                  </Grid>
                ))}
              </Grid>
              <div>
                <div style={{ marginTop: "4px", marginBottom: "2vh" }}>
                  <LoadingButton
                    className="mt-1vh gradient"
                    variant="contained"
                    sx={{ color: "snow" }}
                    type="submit"
                    fullWidth
                    disabled={formik.isSubmitting || !formik.isValid}
                    loading={formik.isSubmitting}
                    loadingPosition="start"
                    startIcon={<Done sx={{ color: "snow" }} />}
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default AddFair;
