import * as Yup from "yup";
import { Form, Formik } from "formik";
import {
  CardContent,
  CardHeader,
  Button,
  Grid,
  createTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { LoginSchema } from "schemas";
import { LoginOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "contexts";
import { withAuthLayout } from "layouts";
import { TextInput } from "components/core";
// import { Slider } from "react-lalit-slider";
import { IMG5, LOGO } from "assets";

const Login = () => {
  const { loginUser } = useAppContext();

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const { login, user } = useAppContext();
  const navigate = useNavigate();
  const initialValues = LoginSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.initialValue;
    return accumulator;
  }, {});
  const validationSchema = LoginSchema.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue.validationSchema;
    return accumulator;
  }, {});

  const handleLogin = async (values, submitProps) => {
    try {
      if (user.isAccepted === false) return alert("Please Register Yourself");
      await login(values.email.trim(), values.password.trim());
      navigate("/dashboard");
      // navigate("/login");
    } catch (error) {
      console.log(error);
      submitProps.setSubmitting(false);
      // navigate("/login");
    }
  };
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={5} sx={{ p: 2 }}>
        {" "}
        <div style={{ textAlign: "center" }}>
          <img src={LOGO} width="150" alt="" />
        </div>
        <CardHeader
          title="Sign In"
          subheader="Please enter your credentials to sign in"
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
          onSubmit={handleLogin}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <CardContent>
                {LoginSchema.map((inputItem) => (
                  <TextInput
                    key={inputItem.key}
                    name={inputItem?.name}
                    label={inputItem?.label}
                    type={inputItem?.type}
                    startIcon={inputItem?.startIcon}
                  />
                ))}
                <div className="d-flex place-content-end">
                  <Button
                    sx={{ color: "rgb(37, 82, 167)" }}
                    component={Link}
                    to="/"
                  >
                    Back to Home
                  </Button>{" "}
                  <Button
                    sx={{ color: "rgb(37, 82, 167)" }}
                    component={Link}
                    to="/forgot-password"
                  >
                    Forgot Password?
                  </Button>
                </div>
                <div style={{ textAlign: "right" }}></div>
                <div className="place-content-center">
                  <LoadingButton
                    className="mt-1vh gradient"
                    variant="contained"
                    sx={{ color: "snow" }}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                    loadingPosition="start"
                    startIcon={<LoginOutlined />}
                    fullWidth
                  >
                    Access Panel
                  </LoadingButton>
                </div>
                <div className="d-flex place-content-end mt-1vh">
                  <span>{"Don't Have an Account? "}</span>
                  <Link
                    style={{
                      color: "rgb(37, 82, 167)",
                      textDecoration: "none",
                      marginLeft: "10px",
                    }}
                    to="/university-register"
                  >
                    Register
                  </Link>
                </div>
              </CardContent>
            </Form>
          )}
        </Formik>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={7}
        sx={{ [theme.breakpoints.between("xs", "md")]: { display: "none" } }}
      >
        <div style={{ width: "100%", padding: "30px 20px" }}>
          {/* <Slider Dots={true} Arrow={false} auto={4000}>
						<>
							<div
								style={{
									backgroundImage: `url(${IMG1})`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "contain",
									height: "25em",
									minWidth: "100%",
								}}
							></div>
							<div
								style={{
									backgroundImage: `url(${IMG2})`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "contain",
									height: "25em",
									minWidth: "100%",
								}}
							></div>
							<div
								style={{
									backgroundImage: `url(${IMG3})`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "contain",
									height: "25em",
									minWidth: "100%",
								}}
							></div>
						</>
					</Slider> */}
          <img src={IMG5} style={{ height: "25em", minWidth: "100%" }} alt="" />
        </div>
      </Grid>
    </Grid>
  );
};

export default withAuthLayout(Login);
