import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  CardContent,
  Grid,
  Container,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { EditProfileSchema } from "schemas";
import { Done } from "@mui/icons-material";
import { TextInput } from "components/core";
import { auth, database } from "configs";
import { useAppContext } from "contexts";

const Profile = () => {
  const { snackBarOpen, user } = useAppContext();
  const initialValues = EditProfileSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.initialValue;
      return accumulator;
    },
    {}
  );
  const validationSchema = EditProfileSchema.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue.validationSchema;
      return accumulator;
    },
    {}
  );
  const handleRegister = async (values, submitProps) => {
    try {
      await database.ref(`Users/${auth?.currentUser?.uid}`).update({
        ...values,
        updated_at: new Date().toString(),
      });

      snackBarOpen("Data Updated Successfully", "success");
      submitProps.resetForm();
    } catch (error) {
      console.log(error);
      snackBarOpen(error.message, "error");
      submitProps.setSubmitting(false);
    }
  };
  return (
    <div className="auth-page">
      <Container
        maxWidth="md"
        className="place-content-center place-items-center"
      >
        <Formik
          enableReinitialize
          initialValues={
            user?.email
              ? {
                  displayName: user?.displayName,
                  phoneNumber: user?.phoneNumber,
                  email: user?.email,
                  location: user?.location,
                  contactName: user?.contactName,
                  website: user?.website,
                  country: user?.country,
                }
              : initialValues
          }
          validationSchema={Yup.object(validationSchema)}
          onSubmit={handleRegister}
        >
          {(formik) => (
            <Form>
              <CardContent>
                <Grid container spacing={2} justifyContent="center">
                  {EditProfileSchema.map((inputItem) => (
                    <Grid
                      item
                      key={inputItem.key}
                      xs={12}
                      sm={12}
                      md={inputItem?.name === "country" ? 12 : 6}
                      lg={inputItem?.name === "country" ? 12 : 6}
                    >
                      <Field name={inputItem.name} key={inputItem.key}>
                        {(props) => {
                          if (inputItem.type === "select") {
                            return (
                              <FormControl
                                required
                                fullWidth
                                margin="none"
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
                                        <>{`${option.value} (${option.key}) `}</>
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
                            <TextInput
                              key={inputItem.key}
                              name={inputItem?.name}
                              label={inputItem?.label}
                              disabled={inputItem.name === "email"}
                              type={inputItem?.type}
                              startIcon={inputItem?.startIcon}
                            />
                          );
                        }}
                      </Field>
                    </Grid>
                  ))}
                </Grid>
                <div className="place-content-center">
                  <LoadingButton
                    className="mt-1vh gradient"
                    variant="contained"
                    sx={{ color: "snow" }}
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    loading={formik.isSubmitting}
                    loadingPosition="start"
                    startIcon={<Done />}
                    fullWidth
                  >
                    Save
                  </LoadingButton>
                </div>
              </CardContent>
            </Form>
          )}
        </Formik>
        <></>
      </Container>
    </div>
  );
};

export default Profile;
