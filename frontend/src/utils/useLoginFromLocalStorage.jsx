import { login } from "context/actions";
import Context from "context/context";
import { useContext } from "react";

const useLoginFromLocalStorage = () => {
  const { dispatch } = useContext(Context);
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");
  if (!!token) dispatch(login(userType));
};
export default useLoginFromLocalStorage;
