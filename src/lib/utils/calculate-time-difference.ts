export const calculateTimeDifference = (
  timestamp1: number,
  timestamp2: number
): string => {
  const millisecondsPerSecond = 1000;
  const secondsPerMinute = 60;
  const minutesPerHour = 60;
  const hoursPerDay = 24;

  const currentTime = Math.floor(Date.now() / millisecondsPerSecond);

  const timeDifferenceSeconds = currentTime - Math.max(timestamp1, timestamp2);

  if (timeDifferenceSeconds < secondsPerMinute) {
    return `${timeDifferenceSeconds} seconds ago`;
  } else if (timeDifferenceSeconds < minutesPerHour) {
    const minutesAgo = Math.floor(timeDifferenceSeconds / secondsPerMinute);
    return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  } else if (timeDifferenceSeconds < hoursPerDay * minutesPerHour) {
    const hoursAgo = Math.floor(
      timeDifferenceSeconds / (minutesPerHour * secondsPerMinute)
    );
    return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
  } else {
    const daysAgo = Math.floor(
      timeDifferenceSeconds / (hoursPerDay * minutesPerHour * secondsPerMinute)
    );
    return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
  }
};

export const timeSinceDate = (date: number) => {
  const seconds = Math.floor((new Date().getTime() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ` year${interval > 2 ? "s" : ""} ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ` month${interval > 2 ? "s" : ""} ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ` day${interval > 2 ? "s" : ""} ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ` hour${interval > 2 ? "s" : ""} ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ` minute${interval > 2 ? "s" : ""} ago`;
  }
  return Math.floor(seconds) + ` second${interval > 2 ? "s" : ""} ago`;
};
