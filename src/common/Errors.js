const errors = {
  "fetch-fail": {
    name: "Fetch Error",
    message: <span>Cannot fetch data (PRBZ down?)<br/><small>Check browser console for more details</small></span>
  },
  "empty-payload": {
    name: "Error",
    message: "Empty payload (PRBZ still loading?)"
  },
  "cors-rejected": {
    name: "Fetch Error",
    message: <span>Cannot fetch data (PRBZ is up but request was rejected)<br/><small>Check browser console for more details</small></span>
  }
}

export const handleError = (error) => {
  switch (error.message.toLowerCase()) {
    case "failed to fetch": // Chrome/Opera
    case "networkerror when attempting to fetch resource.": // Firefox
      return errors["fetch-fail"];
    case "empty payload":
      return errors["empty-payload"];
    case "cors rejected":
      return errors["cors-rejected"];
    default:
     return error;
  }
}

export const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 0) {
    throw new Error(`CORS rejected`);
  } else {
    throw new Error(`PRBZ status: ${response.status}`);
  }
}
