declare module 'prompts' {
    export interface Choice {
        title: string;
        value: any;
        disabled?: boolean;
        selected?: boolean;
        description?: string;
    }

    export interface PromptObject<T extends string = string> {
        type: 'text' | 'password' | 'invisible' | 'number' | 'confirm' | 'list' | 'toggle' | 'select' | 'multiselect' | 'autocomplete';
        name: T;
        message?: string | ((prev: any, values: any) => string);
        initial?: any;
        style?: 'default' | 'password' | 'invisible' | 'emoji';
        format?: (val: any) => any;
        validate?: (val: any) => boolean | string | Promise<boolean | string>;
        onState?: (state: any) => void;
        min?: number;
        max?: number;
        choices?: Choice[];
        hint?: string;
        warn?: string;
        suggest?: (input: any, choices: Choice[]) => Promise<Choice[]>;
        limit?: number;
        active?: string;
        inactive?: string;
    }

    export default function prompts<T extends string = string>(
        questions: PromptObject<T> | Array<PromptObject<T>>,
        options?: {
            onSubmit?: (prompt: PromptObject, answer: any) => void;
            onCancel?: (prompt: PromptObject, answers: any) => void;
        }
    ): Promise<{ [K in T]: any }>;
}

declare module 'open' {
    function open(target: string, options?: {
        wait: boolean;
        app?: string | string[];
    }): Promise<any>;
    export default open;
} 