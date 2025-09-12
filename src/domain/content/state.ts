import {EntityAction, entityReducer} from "@/utils/reducer/entityReducer";
import {Prompt, Reply} from "@/domain/content/prompt";

type PromptAction = {
    type: 'ADD_PROMPT',
    payload: Prompt
}

type ReplyAction = EntityAction<Reply>
type ContentAction = PromptAction | ReplyAction;

export function reduceContentUpdate(action: ContentAction, current: Prompt[]) {
    if(isPromptAction(action)) {
        return promptReducer(action, current);
    }

    return replyReducer(action, current);
}

function replyReducer(action: ReplyAction, current: Prompt[]): Prompt[] {
    const { promptId, id } = action.payload;

    return current.map(prompt => {
        if (prompt.id === promptId) {
            const updatedReplies = new Map(prompt.replies);
            updatedReplies.set(id, entityReducer(action, updatedReplies.get(id)));
            return {
                ...prompt,
                replies: updatedReplies
            };
        }
        return prompt;
    });
}

function isPromptAction(action: ContentAction): action is PromptAction {
    return action.type === 'ADD_PROMPT';
}

function promptReducer(action: ContentAction, current: Prompt[]) {
    if(action.type === 'ADD_PROMPT') {
        return [...current, action.payload]
    }

    throw new Error(`Unknown prompt action: ${action.type}`);
}