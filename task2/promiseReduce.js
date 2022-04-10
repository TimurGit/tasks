var fn1 = () => {
    console.log('fn1')
    return Promise.resolve(1)
}
var fn2 = () => new Promise(resolve => {
    console.log('fn2')
    setTimeout(() => resolve(2), 2000)
})
var fn3 = () => new Promise(resolve => {
    console.log('fn3')
    setTimeout(() => resolve(3), 1000)
})

function promiseReduce(asyncFunctions, reduce, initialValue) {
    /*
    * Реализация
    */
    return new Promise(function (resolve, reject) {
        asyncFunctions.reduce((prev, cur) => {
            return prev.then(() => {
                return new Promise((resolve, reject) => {
                    cur().then(value => {
                        prev.then((prevValue) => resolve(reduce(prevValue, value)));
                    }).catch(e => reject(e));
                });
            });
        }, Promise.resolve(initialValue)).then(
            (res) => resolve(res),
            (e) => reject(e)
        );
    })
}

promiseReduce(
    [fn1, fn2, fn3],
    function (memo, value) {
        console.log('reduce', value);
        return memo * value
    },
    1
)
    .then(value => console.log(value))
    .catch(error => console.log('error', error))
