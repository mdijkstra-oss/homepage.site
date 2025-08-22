import { render } from 'preact';
import {useReducer, useState} from "preact/hooks";

import './style.css';

import Tabs from '@/components/Tabs';
import Terminal from '@/components/Terminal';
import Prompt from '@/components/Prompt';
import {parseCommand} from "@/domain/command/parse/parse";
import {ExecutingCommand, toPipeline} from "@/domain/command/exec/exec";

type AppTheme = 'light' | 'dark';

type Actions = 'append'
type ReducerAction = { type: Actions; payload: ExecutingCommand }

const App = () => {

	function commandsReducer(state: ExecutingCommand[], action: ReducerAction): ExecutingCommand[] {
		switch (action.type) {
			case 'append':
				return [...state, action.payload]
			default:
				return state;
		}
	}

	const [executingCommands, dispatch] = useReducer(commandsReducer, []);
	const [theme, setTheme] = useState<AppTheme>('light');

	const onCommandSubmit = (cmd: string)=> {
		const parsed = parseCommand(cmd);
		const stdout = toPipeline(parsed);
		dispatch({type: 'append', payload: {name: cmd, stdout: toPipeline(parsed)}})
	}

	return (
		<>
			<header>
				<Tabs/>
			</header>
			<main>
				<Terminal commands={executingCommands}/>
			</main>
			<footer>
				<Prompt onSubmit={onCommandSubmit} />
			</footer>
		</>
	);
};

render(<App />, document.getElementById('app'));
