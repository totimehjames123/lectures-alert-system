const formatTime = (startTime, endTime, day) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    // Set the day to the start and end dates based on the provided `day`
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(day);
  
    if (dayIndex === -1) {
      return 'Invalid day';
    }
  
    // Align the day to the correct week day
    const adjustDateToDay = (date, dayIndex) => {
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + ((dayIndex + 7 - adjustedDate.getDay()) % 7));
      return adjustedDate;
    };
  
    const startAdjusted = adjustDateToDay(start, dayIndex);
    const endAdjusted = adjustDateToDay(end, dayIndex);
  
    if (now > endAdjusted) {
      const elapsedTime = now - endAdjusted;
      const minutes = Math.floor(elapsedTime / 1000 / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 0) return `Ended ${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `Ended ${hours} hr${hours > 1 ? 's' : ''} ago`;
      return `Ended ${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
  
    if (now > startAdjusted) {
      const remainingTime = endAdjusted - now;
      const minutes = Math.floor(remainingTime / 1000 / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 0) return `Ends in ${days} day${days > 1 ? 's' : ''}`;
      if (hours > 0) return `Ends in ${hours} hour${hours > 1 ? 's' : ''}`;
      return `Ends in ${minutes} min${minutes > 1 ? 's' : ''}`;
    } else {
      const remainingTime = startAdjusted - now;
      const minutes = Math.floor(remainingTime / 1000 / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
      if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
      return `Starts in ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
  };
  
  export default formatTime;
  