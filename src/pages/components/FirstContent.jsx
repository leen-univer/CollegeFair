import { Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
// import { IMG6 } from "assets";

const FirstContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="first-content">
        <div className="left-first-content change_new_clr_text">
          <Typography variant="h6">
            Access Top Schools in The Emirates!
          </Typography>

          <div className="heading change_new_clr">
            <Typography
              variant="h4"
              sx={{
                fontSize: {
                  lg: 30,
                  md: 35,
                  sm: 35,
                  xs: 30,
                },
              }}
            >
              Sign up today to attend our college fairs which are hosted by top
              schools across the UAE!
            </Typography>
          </div>
          <button
            className="btn-container change_new_bg_clr"
            onClick={() => navigate("/university-register")}
          >
            Register
          </button>
        </div>
        <div className="right-first-content">
          {/* <img
						src={IMG6}
						style={{ height: "25em", minWidth: "100%" }}
						alt="study"
						className="new_animated_img"
					/> */}
          {/* <img src={MAINIMG2} alt="study" className="new_animated_img" /> */}
        </div>
      </div>
    </>
  );
};

export default FirstContent;
