import {maxItemAssociation} from "../maxItemAssociation";

jest.unmock('../maxItemAssociation');

it('should without last', () => {
    const items = [
        ["a", "b"], ["a", "c"], ["d", "e"]
    ];
    expect(maxItemAssociation(items)).toEqual(["a", "b", "c"]);
});

it('should all', () => {
    const items = [
        ["q", "w", 'a'],
        ["a", "b"],
        ["a", "c"],
        ["q", "e"],
        ["q", "r"],
    ];
    expect(maxItemAssociation(items)).toEqual(["a", "b", "c", "e", "q", "r", "w"]);
});


it('should without first group', () => {
    const items = [
        ["r", "l", "x"],
        ["a", "n"],
        ["n", "b"],
        ["c", "a"],
        ["c", "q"]
    ];
    expect(maxItemAssociation(items)).toEqual(["a", "b", "c", "n", "q"]);
});

it('should first from the same group', () => {
    const items = [
        ["r", "l", "x"],
        ["x", "y", "z"],
        ["a", "n"],
        ["n", "b"],
        ["c", "a"],
        ["c", "q"]
    ];
    expect(maxItemAssociation(items)).toEqual(["a", "b", "c", "n", "q"]);
});
