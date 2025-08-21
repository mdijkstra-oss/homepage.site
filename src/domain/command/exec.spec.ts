import { executeCommands } from './exec';
import { Command, ControlOperator } from './parse';

describe('executeCommands', () => {
    it('should execute a simple echo command', () => {
        const commands: Command[] = [
            { name: 'echo', args: ['hello', 'world'], argd: {} }
        ];

        const result = executeCommands(commands);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.value.stdout).toBe('hello world');
        }
    });

    it('should handle command not found', () => {
        const commands: Command[] = [
            { name: 'nonexistent', args: [], argd: {} }
        ];

        const result = executeCommands(commands);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.value.stderr).toBe('dish: Command not found: nonexistent');
        }
    });

    it('should pipe output from echo to rev', () => {
        const commands: (Command | ControlOperator)[] = [
            { name: 'echo', args: ['hello'], argd: {} },
            ControlOperator.Pipe,
            { name: 'rev', args: [], argd: {} }
        ];

        const result = executeCommands(commands);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.value.stdout).toBe('olleh');
        }
    });

    it('should handle multiple pipes', () => {
        const commands: (Command | ControlOperator)[] = [
            { name: 'echo', args: ['hello'], argd: {} },
            ControlOperator.Pipe,
            { name: 'rev', args: [], argd: {} },
            ControlOperator.Pipe,
            { name: 'rev', args: [], argd: {} }
        ];

        const result = executeCommands(commands);

        expect(result.success).toBe(true);
        if (result.success) {
            // double reverse
            expect(result.value.stdout).toBe('hello');
        }
    });

    it('should stop execution when a command fails', () => {
        const commands: (Command | ControlOperator)[] = [
            { name: 'nonexistent', args: [], argd: {} },
            ControlOperator.Pipe,
            { name: 'rev', args: [], argd: {} }
        ];

        const result = executeCommands(commands);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.value.stderr).toBe('dish: Command not found: nonexistent');
            expect(result.value.stdout).toBeUndefined();
        }
    });

    it('should return error for empty command list', () => {
        const commands: (Command | ControlOperator)[] = [];

        const result = executeCommands(commands);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toBe('No commands to execute');
        }
    });
});