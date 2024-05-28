import moment from 'moment';

/**
 * Takes a time in 'h:mma' format (e.g., '9:00AM') and a date in 'DD/MM/YYYY' format (e.g., '31/12/2024'),
 * combines them, and returns the Unix timestamp in milliseconds.
 * @param time - Time string in 'h:mma' format.
 * @param date - Date string in 'DD/MM/YYYY' format.
 * @returns Unix timestamp in milliseconds.
 */
export function formatTimeDateString(time: string, date: string): number {
    // Combine date and time into one string, adjusting the format to match moment's parsing requirements
    const dateTime = `${date} ${time}`;

    // Create a moment object from the dateTime string with the correct formats
    const momentDateTime = moment(dateTime, 'DD/MM/YYYY h:mma');

    // Return the Unix timestamp in milliseconds
    return momentDateTime.valueOf();
}