import { createRoot } from 'react-dom/client';
import { PrimaryLayout } from "@/layouts/PrimaryLayout";
import './style.css';

const App = () => {
	return <PrimaryLayout />;
};

createRoot(document.getElementById('app')!).render(<App />);
