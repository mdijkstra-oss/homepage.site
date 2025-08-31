import {FunctionComponent} from 'preact';
import './style.css'

interface PromptProps {
    onSubmit: (input: string) => void;
}

export const Prompt: FunctionComponent<PromptProps> = ({onSubmit}) => {

    function onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (e instanceof KeyboardEvent && e.key === 'Enter') {
            onSubmit(input.value);
            input.value = ''; // Clear the input after submitting
        }
    }
    
    return (
        <>
            <input type="text" onKeyPress={onChange} class="prompt-input"/>
        </>
    );
};
