interface ProgramDate {
    startTimeTimeStamp: number;
    endTimeTimeStamp: number;
}

export function getStartTimeStampOfProgram(dates: ProgramDate[]): number {
    /*
        Gets the earliest start timestamp based on the dates of a program.
        Assumes that the input array is non-empty and valid.
    */
    if (dates.length === 0) {
        throw new Error("Dates array is empty");
    }

    
    let earliest = dates[0].startTimeTimeStamp; // Initialize with the first date's start time
    dates.forEach(date => {
        if (date.startTimeTimeStamp < earliest) {
            earliest = date.startTimeTimeStamp;
        }
    });
    console.log("EARLIEST", earliest)
    return earliest
}

export function getEndTimeStampOfProgram(dates: ProgramDate[]): number {
    /*
        Gets the latest end timestamp based on the dates of a program.
        Assumes that the input array is non-empty and valid.
    */
    if (dates.length === 0) {
        throw new Error("Dates array is empty");
    }
    
    let latest = dates[0].endTimeTimeStamp; // Initialize with the first date's end time
    dates.forEach(date => {
        if (date.endTimeTimeStamp > latest) {
            latest = date.endTimeTimeStamp;
        }
    });
    return latest
}
