import {sum} from '../sum';

jest.unmock('../sum');

it('should sum arguments', () => {
    expect(sum(1)(2)(3)()).toBe(6);
});

it("should error", () => {
    expect(() => sum()).toThrow('function must have arguments');
});