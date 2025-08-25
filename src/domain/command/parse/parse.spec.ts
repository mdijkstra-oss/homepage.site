import {commandStringToCommandSequence, parseArgs} from './parse';

function checkCommand(input: string, expected: any) {
  const result = commandStringToCommandSequence(input);
  expect(result).toEqual(expected);
}

describe('parseCommand', () => {
  it('should parse a simple command', () => {
    checkCommand('ls', [{name: 'ls', args: [], argd: {}}]);
  });

  it('should parse a command with arguments', () => {
    checkCommand('ls -la', [{name: 'ls', args: ['-la'], argd: {la: true}}]);
  });

  it('should parse a command with multiple arguments', () => {
    checkCommand('git commit -m "Initial commit"', [
      {name: 'git', args: ['commit', '-m', 'Initial commit'], argd: {commit: true, m: 'Initial commit'}}
    ]);
  });

  it('should handle empty input', () => {
    checkCommand('', []);
  });

  it('should handle input with multiple spaces', () => {
    checkCommand('echo  hello  world', [{name: 'echo', args: ['hello', 'world'], argd: { hello: true, world: true }}]);
  });
});

describe("parseArgs", () => {


  function checkArgs(input: string[], expected: any) {
    const result = parseArgs(input);
    expect(result).toEqual(expected);
  }

  describe('parseArgs', () => {
    it('should parse key-value arguments with spaces', () => {
      checkArgs(['--foo', 'bar'], {foo: 'bar'});
    });

    it('should parse multiple standalone arguments', () => {
      checkArgs(['baz', 'bar'], { baz: true, bar: true });
    });

    it('should parse key-value arguments with equals sign', () => {
      checkArgs(['bar=baz'], {bar: 'baz'});
    });

    it('should parse mixed arguments', () => {
      checkArgs(['--foo', 'bar', 'baz', 'qux=quux'], {
        foo: 'bar',
        qux: 'quux',
        baz: true
      });
    });

    it('should handle empty input', () => {
      checkArgs([], {});
    });
  });

})
