/*1. Declare a Function
2. return new Promise
3. new Promise receive a callback and the callback need two argument
4. that two arguments are resolve and reject respectively
5. when the callback is work and done use resolve function if error or fail use reject
6. simple code 
 */
function asyncFunction() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Async Hello world');
        }, 16);
    });
}

asyncFunction().then(function (value) {
    console.log(value);    // => 'Async Hello world'
}).catch(function (error) {
    console.log(error);
});
or write it as follows
asyncFunction().then(console.log).catch(console.log);
/*
instance of Promise have 3 state
"has-resolution" - Fulfilled
當你成功在instance 的callback 成功使用resolve( )時。
此時狀態會變更，並調用 onFulfilled

"has-rejection" - Rejected
當你成功在instance 的callback 成功使用reject( )時。
此時狀態會變更，並調用 onRejected

"unresolved" - Pending
Promise剛建立且沒有成功的在 instance 的callback裡使用resolve或reject的狀態
Precisely speaking
我覺得其實是調用了
Promise.prototype.onFulfilled
Promise.prototype.onRejected

覺得以後Promise化的 lib會越來越多，
到時用async-await寫非同步將變的沒有難度可言(雖然目前也沒多難就是了)
只剩寫底層api的人會需要學Promise和其運作原理
參考
http://liubin.org/promises-book/

這應該是目前寫的最詳細、完整、易懂的 Promise教學
*/
