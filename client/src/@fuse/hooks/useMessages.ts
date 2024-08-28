import { useAppDispatch } from "app/store/hooks";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

export const useMessages = () => {
  const dispatch = useAppDispatch();
  const showError = (message) => {
    displayMessage(dispatch, "error", message);
  };
  const showSuccess = (message) => {
    displayMessage(dispatch, "success", message);
  };
  return { showError, showSuccess };
};

const displayMessage = (dispatch, variant, message) => {
  dispatch(
    showMessage({
      message: message, //text or html
      autoHideDuration: 6000, //ms
      anchorOrigin: {
        vertical: "top", //top bottom
        horizontal: "center", //left center right
      },
      variant: variant, //success error info warning null
    })
  );
};
