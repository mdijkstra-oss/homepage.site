import {useArrayReducer} from "@/hooks/useArrayReducer";
import {ExecutingCommand, toPipeline} from "@/domain/command/exec/exec";
import {useEffect} from "preact/hooks";
import {useRouter} from "@/hooks/useRouter";
import {commandStringToCommandSequence} from "@/domain/command/parse/parse";
import {createAction} from "@/hooks/reducer";
import { Navigation } from "@/components/PrimaryLayout/Navigation";
import { ContentFeed } from "./ContentFeed";
import { Prompt } from "@/components/PrimaryLayout/Prompt";
import {mapCommandSequencesToRoute, mapRouteToCommandSequences} from "./routing";

import style from './layout.module.css'

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
            dispatch(createAction('append', { sequence: commandSequence, stdout }))
        }
    }, [route]);

    return (
        <>
            <header>
                <Navigation />
            </header>
            <div class={style.outerContainer}>
                <aside>
                    Asideness
                </aside>
                <div class={style.contentContainer}>
                    <main className={style.container}>
                        <ContentFeed commands={executingCommands}/>
                    </main>
                    <footer>
                        <Prompt onSubmit={onCommandSubmit}/>
                    </footer>
                </div>
            </div>
        </>
    );
}