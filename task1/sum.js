export function sum(arg){
    if (typeof arg === 'undefined'){
        throw new Error('function must have arguments');
    }
    return (arg2 => {
        if (typeof arg2 === 'undefined'){
            return arg;
        }
        return sum(arg + arg2);
    });
}
