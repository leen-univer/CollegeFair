import { Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, CardHeader, Container } from "@mui/material";
import { LOGO } from "assets";
import { TextInput } from "components/core";
import { auth, database } from "configs";
import { useAppContext } from "contexts";
import { Form, Formik } from "formik";
import { useUniversities } from "hooks";
import { MessageSchema } from "schemas";
import * as Yup from "yup";

const UniversitySupport = () => {
  const { user, snackBarOpen } = useAppContext();

  const { universities } = useUniversities();
  const SUPERADMIN = universities?.filter(
    (university) => university?.role === "superadmin"
  )[0];

  const { sendNotification, sendMail } = useAppContext();

  const initialValues = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = MessageSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});
  const handleUniversitySupport = async (values, submitProps) => {
    try {
      await database.ref(`Supports/${auth.currentUser.uid}`).push({
        ...values,
        timestamp: new Date().toString(),
        universityName: user?.displayName,
        email: user?.email,
      });

      const notification = {
        title: "Help Message",
        description: `Help message received`,
        read: false,
        timestamp: new Date().toString(),
      };

      sendNotification({
        notification: {
          title: `Help Message`,
          body: `Help message received`,
        },
        FCMToken: SUPERADMIN?.fcmToken,
      });
      sendMail({
        to: SUPERADMIN?.email,
        subject: "Help message",
        html: `Help message received`,
      });
      database.ref(`Notifications/${SUPERADMIN?.uid}`).push(notification);

      snackBarOpen("Your Message Sent", "success");
      submitProps.resetForm();
    } catch (error) {
      snackBarOpen(error.message, "error");
      submitProps.resetForm();
      console.log(error);
      submitProps.setSubmitting(false);
    }
  };
  return (
    <div className="">
      <Container
        maxWidth="sm"
        className=" h-75vh place-content-center place-items-center"
      >
        <Card>
          <div style={{ textAlign: "center", paddingTop: "2vh" }}>
            <img src={LOGO} width="150" alt="" />
          </div>
          <CardHeader
            title="Need Some Help ?"
            subheader="Don't Worry Drop a Message..."
            titleTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
            subheaderTypographyProps={{
              gutterBottom: true,
              align: "center",
            }}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={handleUniversitySupport}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <CardContent>
                  {MessageSchema.map((inputItem) => (
                    <TextInput
                      key={inputItem.key}
                      name={inputItem?.name}
                      label={inputItem?.label}
                      type={inputItem?.type}
                      startIcon={inputItem?.startIcon}
                      multiline
                      rows={inputItem?.rows}
                    />
                  ))}
                  <div className="place-content-center">
                    <LoadingButton
                      className="mt-1vh gradient"
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      loading={isSubmitting}
                      loadingPosition="start"
                      startIcon={<Send />}
                      le
                      fullWidth
                      sx={{ color: "snow" }}
                    >
                      Send Message
                    </LoadingButton>
                  </div>
                </CardContent>
              </Form>
            )}
          </Formik>
        </Card>
      </Container>
    </div>
  );
};

export default UniversitySupport;
