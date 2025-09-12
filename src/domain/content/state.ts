import {EntityAction, entityReducer} from "@/utils/entityReducer";
import {Prompt, Reply} from "@/domain/content/prompt";
import {combineReducers} from "@/utils/reducer";

type PromptAction = {
    type: 'ADD_PROMPT',
    payload: Prompt
}

type ReplyAction = EntityAction<Reply>

export type ContentAction = PromptAction | ReplyAction;

export const contentReducer = combineReducers(
    promptReducer,
    replyReducer,
)

function replyReducer(action: ReplyAction, current: Prompt[]): Prompt[] {
    if (!isReplyAction(action)) return current;

    const { promptId, id } = action.payload;

    return current.map(prompt => {
        if (prompt.id === promptId) {
            const updatedReplies = new Map(prompt.replies);
            updatedReplies.set(id, entityReducer(action, updatedReplies.get(id), ['id']));
            return {
                ...prompt,
                replies: updatedReplies
            };
        }
        return prompt;
    });
}

function isReplyAction(action: ContentAction): action is ReplyAction {
    return !isPromptAction(action);
}

function promptReducer(action: ContentAction, current: Prompt[]) {
    if(!isPromptAction(action)) return current;

    if(action.type === 'ADD_PROMPT') {
        return [...current, action.payload]
    }
}

function isPromptAction(action: ContentAction): action is PromptAction {
    return action.type === 'ADD_PROMPT';
}