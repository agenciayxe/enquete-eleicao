declare interface Question {
    id: number;
    survey_id: number;
    answers: Answer[];
    body: string;
    group: string;
    order: number;
    type: number;
}