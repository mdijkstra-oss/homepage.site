import {FunctionalComponent} from "preact";
import {ExecStream, ExecutingCommand} from "@/domain/command/exec/exec";

import './style.css'
import {useEffect, useReducer} from "preact/hooks";

interface TerminalEntryProps {
    stdout: ExecStream;
    title: string
}

type Actions = 'append'
type ReducerAction = { type: Actions; payload: string }

const TerminalEntry: FunctionalComponent<TerminalEntryProps> = ({ stdout, title }) => {
    const [aggregate, dispatch] = useReducer(
        (state: string, action: ReducerAction) => {
            switch (action.type) {
                case 'append':
                    return state + action.payload;
                default:
                    return state;
            }
        },
        ''
    );

    useEffect(() => {
        let cancelled = false;

        async function processStream() {
            for await (const chunk of stdout) {
                if (cancelled) return;
                dispatch({ type: 'append', payload: chunk });
            }
        }

        void processStream();

        return () => {
            cancelled = true;
        };
    }, [stdout]);

    return (
        <div className="terminal-command">
            <div className="terminal-input">{title}</div>
            <div className="terminal-output terminal-stdout">{aggregate}</div>
        </div>
    );
};


export default TerminalEntry