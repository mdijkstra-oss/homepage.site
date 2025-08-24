import { render } from 'preact';
import {useState} from "preact/hooks";

import {Terminal} from "@/components/Terminal/Terminal";

import './style.css';

type AppTheme = 'light' | 'dark';

const App = () => {
	const [theme, setTheme] = useState<AppTheme>('light');

	return <Terminal />
};

render(<App />, document.getElementById('app'));
