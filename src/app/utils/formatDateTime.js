export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);

  // Format the date
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  // Format the time
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return { formattedDate, formattedTime };
};

export const formatTime = (time) => {
  const date = new Date(time);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  return formattedTime;
};
