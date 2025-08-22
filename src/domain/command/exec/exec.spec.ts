import { toPipeline } from './exec';
import {Command, CommandList, ControlOperator} from '../parse/parse';
import { collectStr } from '@/utils/stream';

async function testPipeline(commands: CommandList, expected?: string) {
    const pipeline = toPipeline(commands);
    const output = await collectStr(pipeline);
    expect(output).toBe(expected);
}

describe('Command Execution', () => {
    it('should execute a simple echo command', async () => {
        const commands: Command[] = [
            { name: 'echo', args: ['hello', 'world'], argd: {} }
        ];

        await testPipeline(commands, 'hello world');
    });

    it('should handle command not found', async () => {
        const commands: Command[] = [
            { name: 'nonexistent', args: [], argd: {} }
        ];

        await testPipeline(commands, 'Command not found: nonexistent');
    });

    it('should pipe output from echo to rev', async () => {
        const commands: CommandList = [
            { name: 'echo', args: ['hello'], argd: {} },
            { name: 'rev', args: [], argd: {} }
        ];

        await testPipeline(commands, 'olleh');
    });

    it('should stop execution when a command fails', async () => {
        const commands: CommandList = [
            { name: 'nonexistent', args: [], argd: {} },
            { name: 'rev', args: [], argd: {} }
        ];

        await expect(testPipeline(commands)).rejects.toThrowError('Command not found: nonexistent');
    });

    it('should return empty output for empty command list', async () => {
        const commands: CommandList = [];

        await testPipeline(commands, '');
    });
});
