import {useArrayReducer} from "@/hooks/useArrayReducer";
import {ExecutingCommand, toPipeline} from "@/domain/command/exec/exec";
import {useEffect} from "react";
import {useRouter} from "@/hooks/useRouter";
import {commandStringToCommandSequence} from "@/domain/command/parse/parse";
import {createAction} from "@/hooks/reducer";
import { Navigation } from "@/layouts/PrimaryLayout/Navigation/Top";
import { ContentFeed } from "./ContentFeed";
import { Prompt } from "@/layouts/PrimaryLayout/Prompt";
import {mapCommandSequencesToRoute, mapRouteToCommandSequences} from "./routing";

import style from './layout.module.css'
import {ExternalLink} from "@/layouts/PrimaryLayout/Navigation/Top/Navigation";


export const defaultExternalLinks: ExternalLink[] = [
    { tag: "codeberg", url: "https://codeberg.org/mdijkstra" },
    { tag: "linkedin", url: "https://www.linkedin.com/in/matthijn-dijkstra-65527199/" },
]

export const PrimaryLayout = () => {
    const [executingCommands, dispatch] = useArrayReducer<ExecutingCommand>()
    const {route, navigate} = useRouter()

    const onCommandSubmit = (cmd: string)=> {
        const commands = commandStringToCommandSequence(cmd)
        navigate(mapCommandSequencesToRoute([commands]))
    }

    useEffect(() => {
        const commandSequences = mapRouteToCommandSequences(route);
        for (const commandSequence of commandSequences) {
            const stdout = toPipeline(commandSequence);
            // @ts-ignore
            dispatch(createAction('append', { sequence: commandSequence, stdout }))
        }
    }, [route]);

    return (
        <>
            <header>
                <Navigation externalLinks={defaultExternalLinks} />
            </header>
            <div className={style.outerContainer}>
                <aside>
                    Asideness
                </aside>
                <div className={style.contentContainer}>
                    <main className={style.container}>
                        <ContentFeed commands={executingCommands}/>
                    </main>
                    {/*<footer>*/}
                    {/*    <Prompt onSubmit={onCommandSubmit}/>*/}
                    {/*</footer>*/}
                </div>
            </div>
        </>
    );
}