export interface IQuestion {
    number: number;
    question: string;
    options: string[];
    answers: string[];
    selectedOptions?: string[];
    type: 'multi option' | 'single option';
}

export interface UserAnswer {
    number: number;
    answers: string[];
}