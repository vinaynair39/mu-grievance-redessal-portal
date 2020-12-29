import React, { useContext, useState } from "react";
import jwtDecode from "jwt-decode";
import { useMutation } from "react-query";
import Navbar from "components/PublicNavbar/PublicNavbar";
import RegisterForm from "components/RegisterForm/RegisterForm";
import LoginForm from "components/LoginForm/LoginForm";
import Context from "context/context";
import { registerUser, loginUser, setAuthorizationHeader, verifyUser } from "APIs/user";
import { errorMessage, successMessage } from "utils/modalMessage";
import { validObject } from "utils/validObject";
import { OtpOnlyModal } from "components/CustomModals/CustomModals";
import { login } from "context/actions";
import { ReactComponent as Bg } from "assets/bg.svg";

import "./HomePage.scss";

const HomePage = () => {
  const [type, setType] = useState(() => "LOGIN");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpModalTitle, setOtpModalTitle] = useState("An OTP has been sent to your Email ID. Enter that OTP here to successfully register.");
  const { dispatch } = useContext(Context);

  const [registerMutation, { isLoading: registerLoading }] = useMutation(registerUser, {
    onSuccess: () => {
      setShowVerifyModal(true);
    },
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  const [loginMutation, { isLoading: loginLoading }] = useMutation(loginUser, {
    onError: ({ response }) => {
      if (validObject(response) && response.data.toLowerCase().includes("verify")) {
        setShowVerifyModal(true);
        setOtpModalTitle(response.data);
      } else {
        errorMessage(validObject(response) && response.data);
      }
    },
    onSuccess: (token) => {
      const { userType, id, imageUrl } = jwtDecode(token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("id", id);
      localStorage.setItem("imageUrl", imageUrl);
      setAuthorizationHeader(token, userType);
      dispatch(login(userType));
    },
  });

  const [verifyMutation, { isLoading: verifyLoading }] = useMutation(verifyUser, {
    onSuccess: ({ data: { message } }) => {
      setShowVerifyModal(false);
      successMessage(message);
      setType("LOGIN");
    },
  });

  return (
    <>
      <OtpOnlyModal
        title={otpModalTitle}
        onSubmit={verifyMutation}
        visible={showVerifyModal}
        loading={verifyLoading}
        onCancel={() => {
          setShowVerifyModal(false);
        }}
      />
      <div className="HomePage">
        <Navbar />
        <div className="HomePage__content animate__animated animate__fadeIn">
          <div className="HomePage__bg">
            <h1 className="animate__animated animate__slideInUp">We are here to help you.</h1>
            <Bg />
          </div>
          <div className="HomePage__form">
            {type === "LOGIN" ? (
              <LoginForm loading={loginLoading} onSubmit={loginMutation} setType={setType} />
            ) : (
              <RegisterForm loading={registerLoading} onSubmit={registerMutation} setType={setType} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
