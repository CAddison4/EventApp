export function formatDate(dateStr) {
    // create a Date object from the date string
    const date = new Date(dateStr);
  
    // extract the month, day, and year values
    const month = date.getMonth() + 1; // months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
  
    // create a formatted date string in the desired format
    const formattedDate = `${month}-${day}-${year}`;
  
    return formattedDate;
  }

  export function formatDateTime(dateTimeStr) {
    // create a Date object from the date string
    const date = new Date(dateTimeStr);
  
    // extract the month, day, and year values
    const month = date.getMonth() + 1; // months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const mins = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedDate = `${month}-${day}-${year} ${formattedHours}:${mins} ${ampm}`;
  
    return formattedDate;
  }