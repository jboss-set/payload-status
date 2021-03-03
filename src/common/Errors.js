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
  switch (error.message) {
    case "Failed to fetch":
      return errors["fetch-fail"];
    case "Empty payload":
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
