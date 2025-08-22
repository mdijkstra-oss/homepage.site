import {Executor} from "@/domain/command/exec/exec";
import {reverse} from "@/utils/string";
import {createAggregatingExecutor} from "@/domain/command/exec/executorFactory";

export const rev: Executor = createAggregatingExecutor(reverse)
