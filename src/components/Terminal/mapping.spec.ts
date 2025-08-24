import { mapCommandToRoute, mapRouteToCommand } from './mapping';

describe('mapCommandToRoute', () => {
  it('should convert a simple command to a route', () => {
    expect(mapCommandToRoute('fetch')).toBe('/fetch');
  });

  it('should convert a command with pipes to a route with slashes', () => {
    expect(mapCommandToRoute('fetch | transform')).toBe('/fetch/transform');
  });

  it('should handle spaces around pipes correctly', () => {
    expect(mapCommandToRoute('fetch|transform')).toBe('/fetch/transform');
    expect(mapCommandToRoute('fetch | transform')).toBe('/fetch/transform');
    expect(mapCommandToRoute('fetch  |  transform')).toBe('/fetch/transform');
  });

  it('should convert flags with -- correctly', () => {
    expect(mapCommandToRoute('fetch | transform --uppercase')).toBe('/fetch/transform--uppercase');
  });

  it('should handle multiple flags correctly', () => {
    expect(mapCommandToRoute('fetch | transform --uppercase --trim')).toBe('/fetch/transform--uppercase--trim');
  });

  it('should handle complex commands with multiple pipes and flags', () => {
    expect(mapCommandToRoute('fetch | filter | transform --uppercase | output --format=json')).toBe(
      '/fetch/filter/transform--uppercase/output--format_json'
    );
  });
});

describe('mapRouteToCommand', () => {
  it('should convert a simple route to a command', () => {
    expect(mapRouteToCommand('/fetch')).toBe('fetch');
  });

  it('should convert a route with slashes to a command with pipes', () => {
    expect(mapRouteToCommand('/fetch/transform')).toBe('fetch | transform');
  });

  it('should handle flags with -- correctly', () => {
    expect(mapRouteToCommand('/fetch/transform--uppercase')).toBe('fetch | transform --uppercase');
  });

  it('should handle multiple flags correctly', () => {
    expect(mapRouteToCommand('/fetch/transform--uppercase--trim')).toBe('fetch | transform --uppercase --trim');
  });

  it('should handle complex routes with multiple segments and flags', () => {
    expect(mapRouteToCommand('/fetch/filter/transform--uppercase/output--format_json')).toBe(
      'fetch | filter | transform --uppercase | output --format=json'
    );
  });

  it('should trim extra spaces', () => {
    expect(mapRouteToCommand('/fetch/  transform  ')).toBe('fetch | transform');
  });
});