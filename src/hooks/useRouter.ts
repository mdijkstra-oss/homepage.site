import { useState, useEffect } from 'react';

export function pushRoute(route: string): void {
    window.history.pushState({}, '', route);
}

export function currentRoute(): string {
    return window.location.pathname;
}

export function useRouter(): { route: string; navigate: (path: string) => void } {
    const [route, setRoute] = useState(currentRoute());

    useEffect(() => {
        const handlePop = () => setRoute(currentRoute());
        window.addEventListener('popstate', handlePop);
        return () => window.removeEventListener('popstate', handlePop);
    }, []);

    const navigate = (path: string): void => {
        pushRoute(path);
        setRoute(path);
    };

    return { route, navigate };
}
