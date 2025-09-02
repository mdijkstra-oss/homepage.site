import {ExecResult, ExecStream, Executor} from "@/domain/command/exec/exec";
import {CommandHandler} from "@/domain/command/types";

const data: ExecResult = {
    meta: {
        tags: ["typescript", "docker", "node"]
    },
    payload: "This **JavaScript** project is designed to streamline web development workflows. \nIt includes features like real-time collaboration, automated testing, and robust **state management**. \nThe project leverages modern frameworks and libraries to ensure scalability and maintainability. \nDevelopers can easily integrate it with existing tools to enhance [productivity](https://developer.mozilla.org/en-US/docs/Web/HTML) and efficiency."
}

export const fetch: CommandHandler = {
    executor: async function* (command, stdin?) {
        yield data;
    },
    help: {
        short: 'Fetch project data',
        long: 'Outputs predefined project metadata and content, including tags and a markdown-formatted description.'
    }
};
