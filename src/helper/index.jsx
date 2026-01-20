export function formatDateTime(dateString, locale = 'en-US', options = {}) {
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };

  return date.toLocaleString(locale, { ...defaultOptions, ...options });
}

export function analyzeRatings(ratingsArray) {
  const ratingCounts = {
    oneStarRating: 0,
    twoStarRating: 0,
    threeStarRating: 0,
    fourStarRating: 0,
    fiveStarRating: 0,
    totalRating: 0
  };

  if (ratingsArray.length === 0) {
    return ratingCounts;
  }

  let totalSum = 0;
  let totalRatingsCount = 0;

  for (const entry of ratingsArray) {
    const courseRating = parseInt(entry.courseRating, 10);
    const tutorRating = parseInt(entry.tutorRating, 10);
    const ratings = [courseRating];

    for (const rating of ratings) {
      totalSum += rating;
      totalRatingsCount++;

      switch (rating) {
        case 1:
          ratingCounts.oneStarRating++;
          break;
        case 2:
          ratingCounts.twoStarRating++;
          break;
        case 3:
          ratingCounts.threeStarRating++;
          break;
        case 4:
          ratingCounts.fourStarRating++;
          break;
        case 5:
          ratingCounts.fiveStarRating++;
          break;
        default:
          break;
      }
    }
  }

  ratingCounts.totalRating = totalSum / totalRatingsCount;

  return ratingCounts;
}


export const convertFirestoreTimestampToDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
export const getNamesExcludingId = (data, excludedId) => {
  console.log(data, excludedId, "asdlknasdlnksa")
  if(data){
  return Object?.entries(data)?.filter(([id]) => id !== excludedId)
    .map(([, value]) => value.name);
  }else {
    return ""
  }
};

export const calculateNonZeroPercentage = (data)  => {
  const totalCount = data.length;
    if (totalCount === 0) {
        return "0.00";
    }

    const nonZeroCount = data.filter(item => item.percentage !== 0).length;
    const percentage = (nonZeroCount / totalCount) * 100;
    
    return percentage.toFixed(1);
}


export const deriveBookingStatus = (checkInOut) => {
  if (!checkInOut) return "Booked";

  const [checkInStr, checkOutStr] = checkInOut.split(" - ");

  if (!checkInStr || !checkOutStr) return "Booked";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  if (today < checkIn) {
    return "Booked";
  }

  if (today >= checkIn && today <= checkOut) {
    return "Checked-In";
  }

  if (today > checkOut) {
    return "Checked-Out";
  }

  return "Booked";
};
