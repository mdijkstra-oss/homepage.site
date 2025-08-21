import { render } from 'preact';
import {useReducer, useState} from "preact/hooks";

import './style.css';

import Tabs from '@/components/Tabs';
import Terminal from '@/components/Terminal';
import Prompt from '@/components/Prompt';
import {parseCommand} from "@/domain/command/parse";
import {executeCommands, ExecutedCommand} from "@/domain/command/exec";

type AppTheme = 'light' | 'dark';

const App = () => {
	type AppendExecutedCommand = {
		action: 'append',
		payload: ExecutedCommand
	}

	type CommandList = AppendExecutedCommand

	function commandsReducer(state: ExecutedCommand[], action: CommandList) {
		return [...state, action.payload]
	}

	const [executedCommands, dispatch] = useReducer(commandsReducer, []);
	const [theme, setTheme] = useState<AppTheme>('light');

	const onCommandSubmit = (v: string)=> {
		const parsed = parseCommand(v);
		const executed = executeCommands(parsed)
		if(executed.success) {
			dispatch({action: 'append', payload: executed.value})
		}
		else {
			console.error(executed.error)
		}
	}

	return (
		<>
			<header>
				<Tabs/>
			</header>
			<main>
				<Terminal executedCommands={executedCommands}/>
			</main>
			<footer>
				<Prompt onSubmit={onCommandSubmit} />
			</footer>
		</>
	);
};

render(<App />, document.getElementById('app'));
