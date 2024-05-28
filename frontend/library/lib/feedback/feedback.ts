



export type FeedbackTicket = {
    dateTimeStamp: string;
    feedbackStatus: string;
    id: string;
    inputTypes: string[];
    programID: string;
    questions: string[];
    shiftID: string;
    teacherID: string;
    teachersIDs: string[];
    type: string;
};

export function db_to_feedback(data: any): FeedbackTicket {
    return {
        dateTimeStamp: data.dateTimeStamp,
        feedbackStatus: data.feedbackStatus,
        id: data.id,
        inputTypes: data.inputTypes,
        programID: data.programID,
        questions: data.questions,
        shiftID: data.shiftID,
        teacherID: data.teacherID,
        teachersIDs: data.teachersIDs,
        type: data.type
    };
}