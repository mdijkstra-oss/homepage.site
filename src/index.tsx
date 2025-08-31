import { render } from 'preact';

import { PrimaryLayout } from "@/components/PrimaryLayout";

import './style.css';

const App = () => {
	return <PrimaryLayout />
};

render(<App />, document.getElementById('app'));
