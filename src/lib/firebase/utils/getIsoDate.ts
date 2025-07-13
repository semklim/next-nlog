interface FirebaseDate {
  seconds: number;
  nanoseconds: number;
}

export const getIsoDate = (date?: FirebaseDate): string => {
  if (!date) {
    return new Date().toISOString();
  }

  const milliseconds = date.seconds * 1000 + Math.floor(date.nanoseconds / 1e6);

  const newDate = new Date(milliseconds);
  return newDate.toISOString();
};
