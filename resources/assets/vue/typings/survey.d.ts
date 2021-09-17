declare interface Survey {
    id: number;
    afterword: string;
    cover: string;
    description: string;
    execution: number;
    final_sound: string;
    introduction: string;
    name: string;
    questions: Question[];
    slug: string;
    type: number;
    unique: number;
    created_at: string;
    updated_at: string;
    due_at: string;
  }
  