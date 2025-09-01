import './style.css'

interface PromptProps {
    onSubmit: (input: string) => void;
}

export const Prompt = ({onSubmit}: PromptProps) => {

    function onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (e instanceof KeyboardEvent && e.key === 'Enter') {
            onSubmit(input.value);
            input.value = ''; // Clear the input after submitting
        }
    }
    
    return (
        <>
            <input type="text" onKeyPress={onChange} className="prompt-input"/>
        </>
    );
};
