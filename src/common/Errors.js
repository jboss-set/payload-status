const errors = {
  "fetch-fail": {
    name: "Fetch Error",
    message: "Cannot fetch data (PRBZ down?)"
  },
  "empty-payload": {
    name: "Error",
    message: "Empty payload (PRBZ still loading?)"
  }
}

export const handleError = (error) => {
  switch (error.message.toLowerCase()) {
    case "failed to fetch": // Chrome/Opera
    case "networkerror when attempting to fetch resource.": // Firefox
      return errors["fetch-fail"];
    case "empty payload":
      return errors["empty-payload"];
    default:
     return error;
  }
}

export const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`Server status: ${response.status}`);
  }
}
