import {useArrayReducer} from "@/hooks/useArrayReducer";
import {ExecutingCommand, toPipeline} from "@/domain/command/exec/exec";
import {useEffect, useState} from "preact/hooks";
import {useRouter} from "@/hooks/useRouter";
import {parseCommand} from "@/domain/command/parse/parse";
import {createAction} from "@/hooks/reducer";
import Tabs from "@/components/Terminal/Tabs";
import Panel from "@/components/Terminal/Panel";
import Prompt from "@/components/Terminal/Prompt";
import {mapCommandToRoute, mapRouteToCommand} from "@/components/Terminal/mapping";

export const Terminal = () => {
    const [executingCommands, dispatch] = useArrayReducer<ExecutingCommand>()
    const {route, navigate} = useRouter()

    const onCommandSubmit = (cmd: string)=> {
        navigate(mapCommandToRoute(cmd))
    }

    useEffect(() => {
        const cmd = mapRouteToCommand(route);
        const commands = parseCommand(cmd);
        const stdout = toPipeline(commands);
        dispatch(createAction('append', { commands, stdout }))
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