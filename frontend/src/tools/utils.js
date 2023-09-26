const showSnackError = (error, defaultMessage, enqueueSnackbar) => {
  enqueueSnackbar(
    error?.response?.data?.message
      ? error?.response?.data?.message
      : defaultMessage,
    { variant: "error" }
  );
};

export { showSnackError };
