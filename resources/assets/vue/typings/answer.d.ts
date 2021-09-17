declare interface Answer {
    id: number;
    question_id: number;
    attachment: File;
    body: string;  
    image: string;
    justify: boolean;
    order: number;  
    created_at: string;
    updated_at: string;
}