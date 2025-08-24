import { render } from 'preact';
import {useReducer, useState} from "preact/hooks";

import './style.css';

import Tabs from '@/components/Tabs';
import Terminal from '@/components/Terminal';
import Prompt from '@/components/Prompt';
import {parseCommand} from "@/domain/command/parse/parse";
import {ExecutingCommand, toPipeline} from "@/domain/command/exec/exec";
import {useArrayReducer} from "@/hooks/useArrayReducer";
import {createAction} from "@/hooks/reducer";

type AppTheme = 'light' | 'dark';

const App = () => {

	const [executingCommands, dispatch] = useArrayReducer<ExecutingCommand>()
	const [theme, setTheme] = useState<AppTheme>('light');

	const onCommandSubmit = (cmd: string)=> {
		const commands = parseCommand(cmd);
		const stdout = toPipeline(commands);
		dispatch(createAction('append', { commands, stdout }))
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
