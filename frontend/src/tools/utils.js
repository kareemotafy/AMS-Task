const showSnackError = (error, defaultMessage, enqueueSnackbar) => {
  enqueueSnackbar(
    error?.response?.data?.message
      ? error?.response?.data?.message
      : defaultMessage,
    { variant: "error" }
  );
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const mergeDateAndTime = (date, time) => {
  return new Date(`${date}T${time}`);
};
export { showSnackError, getCookie, mergeDateAndTime };
