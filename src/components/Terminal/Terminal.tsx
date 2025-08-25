import {useArrayReducer} from "@/hooks/useArrayReducer";
import {ExecutingCommand, toPipeline} from "@/domain/command/exec/exec";
import {useEffect, useState} from "preact/hooks";
import {useRouter} from "@/hooks/useRouter";
import {commandStringToCommandSequence} from "@/domain/command/parse/parse";
import {createAction} from "@/hooks/reducer";
import Tabs from "@/components/Terminal/Tabs";
import Panel from "@/components/Terminal/Panel";
import Prompt from "@/components/Terminal/Prompt";
import {mapCommandSequencesToRoute, mapRouteToCommandSequences} from "./routing";

export const Terminal = () => {
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
                <Tabs/>
            </header>
            <main>
                <Panel commands={executingCommands}/>
            </main>
            <footer>
                <Prompt onSubmit={onCommandSubmit} />
            </footer>
        </>
    );
}