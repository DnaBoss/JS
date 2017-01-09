Aspect Oriented Programming in JavaScrip
AOP 大陸翻作 面向切面，
台灣，我實在不知道它被翻作什麼
因為通常被用在後端，所以JS前端往往忽略掉了

而在node.js 後端，也被忽略掉了
僅管已經有很多人用node 在寫後端了
因為js依然是被大多數人視為是前端語言
(這不是重點，所以我也懶得多說什麼)
============================

AOP 是一種 動態的將函數 ，
載入其它函數的技巧，
讓你可以在不用更動(侵入)原函數的前提下，
合併多個函數，或修改原函數。
============================
以下的內容，我盡量用容易google到相關資訊的關鍵字
如果你是其它語言的慣用者
只要直接用關鍵字，都能很容易的查訊到相關資訊

下面為你介紹AOP
你只需要具備最基礎的javascript 能力，
就能立刻用這個技巧，為你的程式重構，
讓你的程式能將核心商業邏輯，和非商業邏輯解耦。
這是我目前覺得javascript中，
CP值最高的技巧，沒有之一。

你只需要能夠清楚的知道
1.this 到底指到那裡
2.apply、call 如何改變 this，當前的receiver是誰
3.知道什麼是閉包

然後....沒有然後，就這三個而己
少到我都不敢相信。
============================
首先，假設我們有一個方法

並且我們要拿這個方法做一些事
我們通常可能會先寫一個函數
function Method() {}
Method.prototype.todo = function(arg) {
    var res;
    // 用arg 做些什麼事，然後存在res
    return res;
}

然後你可能會在很多地方建構這個Method
var method = new Method();
var i_need_to_do= method.todo();

此時，我想要知道 每一個 i_need_to_do 用了我多少時間

第一個方法是在所有用到它的地方，前後加上log
var start = new Date().getTime();
var ico = method.todo(arg);
var end = new Date().getTime();
console.log('ico spend time :', end - start);


比較簡單的方法是去修改原函數，
Method.prototype.todo = function(arg) {
    var res;
    var start = new Date().getTime();
    // 用arg 做些什麼事，然後存在res
    var end = new Date().getTime();
    console.log('ico spend time :', end - start);
    return res;
}

這樣，就只要修改一個地方就好，但這違反SOLID中的OCP原則
(對新功能開放、對修改封閉)

或是使用原型鍊繼承
function MethodChild() {
    Method.apply(this, arguments);
}
MethodChild.prototype = Object.create(Method.prototype);
MethodChild.prototype.todo = function() {
    var start = Date.now();
    //把Method.todo的執行結果存在ico
    var ico = Method.prototype.todo.apply(this, arguments);
    var end = new Date().getTime();
    console.log('ico spend time :', end - start);
    return ico;
}


這樣的確就沒有侵入、修改到Method了
但是原本的 new Method();
通通要改寫成 new MethodChild();

AOP 登場
============================
var origMethod = Method.prototype.todo;

Method.prototype.todo = function() {
    var start = new Date().getTime();
    var ico = origMethod.apply(this, arguments);
    var end = new Date().getTime();
    console.log(fnName + 'excute_time :', end - start);
    return ico;
}

疑，這看起來不就是修改了 Method.todo嗎?
但實際上，這裡做的是一個變數交換的動作
origMethod，才是原來的Method.todo

用 ico，存儲了 Method.prototype.todo 的執行結果
並且在這前後分別加上了時間的log，
最後計算出執行時間

運用AOP, 在這個案列中
帶來的幾個好處
1.原函數不被侵入。
2.不用到處copy、past。
3.不用寫一個新的建構函數。


接下來正式介紹 after、before跟around
Function.prototype.before = function(beforefn) {
    var __orig = this;
    return function() {
        beforefn.apply(this, arguments);
        return __orig.apply(this, arguments);
    }
};


先執行 原函數 再執行 afterfn
Function.prototype.after = function(afterfn) {
    var __orig = this;
    return function() {
        var ret = __orig.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};


先執行 beforefn 然後執行 原函數 最後執行 afterfn

Function.prototype.around = function(beforefn, afterfn) {
    var __orig = this;
    return function() {
        return __orig.before(beforeFunc).after(afterFunc).apply(this, args);
    }
}

其實有 after和before 就夠了我覺得

有了這二個工具，我們就能在任何function 前後
插入我們想做的事情 ，
只要你想讓它跟核心邏輯分離，
就把它抽離成一個function，
接下來，你愛怎麼插就怎麼插，想插幾次就插幾次(誤)
first，we try a very simple test

var test = function() { console.log(2); };
test.before(function() {
    console.log(1);
}).after(function() {
    console.log(3);
});

//1
//2
//3


我個人覺得啊，寫出一個好的、乾淨的code的先決條件是
你得先寫出又髒又爛的code，
我沒在開玩笑。

所以我們來模擬一下
假設現在有一個 遊戲 or 購物網 or 某種會員制的商業架構
黃金會員，這個月有繳會費，則他可以得到1000點回饋點數
普通會員，這個月有繳會費，則他可以拿到300點回饋點數
非會員，不用繳費，沒有回饋點數
有繳會費的會員，可以優先拿商品，不受數量限額的管制
會員如果這個月沒繳會費，
拿不到回饋點數，也沒有優先購買權，等同非會員

首先來定義一下參數
member : 1 是黃金會員、2 是普通會員、3 非會員
pay : 有付費 true、沒付費 false
stock:商品數量
我們想要寫一個function，
根據會員等級，繳費情況，給回饋點數，判斷他能不能買商品 
var sell_logic = function(member, pay, stock) {
    if (member === 1) { //黃金會員
        if (pay) { //有繳會費
            console.log('獲得回饋點數1000點，並保證取得商品')
                //沒有也要生給他就對了
        } else { //沒繳錢
            if (stock > 0) { //還有庫存
                console.log('沒有回饋點數，但能取得商品');
            } else { //沒繳錢又沒庫存
                console.log('什麼都沒有，誰叫你不繳會費');
            }
        }
    } else if (member === 2) {
        if (pay) {
            console.log('獲得回饋點數300點，並保證取得商品')
        } else {
            if (stock > 0) {
                console.log('沒有回饋點數，但能取得商品');
            } else {
                console.log('什麼都沒有，誰叫你不繳會費');
            }
        }

    } else if (member === 3) {
        if (stock > 0) {
            console.log('沒有回饋點數，但能取得商品');
        } else {
            console.log('什麼都沒有，誰叫你不繳會費');
        }
    }
}
sell_logic(2, true, 3);
//獲得回饋點數300點，並保證取得商品


我不知道我有沒有寫過這種東西，但願是沒有

用 AOP + 職責鏈

首先把邏輯抽出來
var gold = function(member, pay, stock) {
    if (member === 1 && pay === true) //黃金會員 且 有繳會費
        console.log('獲得回饋點數1000點，並保證取得商品');
    else
        return false; //你家的事，反正就不是我要管的
}
var normal = function(member, pay, stock) {
    if (member === 2 && pay === true) //普通會員 且 有繳會費
        console.log('獲得回饋點數300點，並保證取得商品');
    else
        return false; //你家的事，反正就不是我要管的
};
var non = function(member, pay, stock) {
    if (stock > 0) {
        console.log('沒有回饋點數，但能取得商品');
    } else {
        console.log('什麼都沒有，誰叫你不繳會費');
    }
};
//修改一下 after
Function.prototype.after = function(afterfn) {
    var __orig = this;
    return function() {
        var ret = __orig.apply(this, arguments);
        if (ret === false)
            return afterfn.apply(this, arguments);
        return ret;
    }
};
<
var logic = gold.after(normal).after(non);
logic(1, true, 4);//獲得回饋點數1000點，並保證取得商品
logic(2, true, 0);//獲得回饋點數300點，並保證取得商品
logic(1, false, 0);//什麼都沒有，誰叫你不繳會費
logic(3, false, 2);//沒有回饋點數，但能取得商品


同時，我可以隨時刪掉任何一個判斷
例如，廢除掉普通會員
只需要將程式改寫如下
var logic = gold.after(non);

這是一個簡化的列子，實際的邏輯中
可能會有 一長串的 if else
隨時可以將任何一個邏輯抽離


======================
 javascript 是非常容易crush的程式
有時候又常常容易取不到值
然後就crush了
例如
 function Angel(para) {
     var name = para.name;
 }
 var i_will_crush = Angel();

你可能會檢查Angel
function Angel(para) {
     if (!para)
         return;
     var name = para.name;
 }

 var i_will_crush = Angel();

那你要檢查型別呢、要檢查一堆有的沒有的呢?
你的Angel 會越寫越大，
而且都是跟你的商業邏輯無關的
那我們乾脆把檢查參數的各種方法，抽離Angel
 
//僅示範檢查參數有沒有值
var checkArg = function() {

     for (var i = 0; i < arguments.length; i++) {
         if (!arguments[i])
             return false;
         //你可以改寫這個方法，改成深層檢查
         //you can overwrite this method to deep check
     }
     return true;
 };

然後再 修改 before

Function.prototype.before = function(beforefn) {
     var __orig = this;
     return function() {
         if (arguments.length === 0 || beforefn.apply(this, arguments) === false) {
             console.log(__orig.name + " arg miss ");
             return;
         }
         return __orig.apply(this, arguments);
     }
 };
function Angel(para) {
     var name = para.name;
 }
 var i_never_cursh = Angel.before(checkArg);
 i_never_cursh();//Angel arg miss
 i_never_cursh('aa', null);//Angel arg miss

你可以做例外拋出或其它處理，
這裡只簡單的做錯誤提示，
這樣你可以避免了，
因為不可預期(機器)或他人(同事)錯誤
而導致的 crush

同時保持商業邏輯的乾淨


單單只靠一個AOP

我便做到了 SOLID 中的
S(單一職責) 和 O(開放封閉)

AOP也可以運用運在 驗證表單
將驗證及行為(send)解耦，
像 express 的 mid ware 也用到了 AOP的技巧

也可以將任何跟商業邏輯無關的內容抽離
例如你常常寫在程式裡的try catch
也一樣可以把它抽出來
如果你要做框架的開發，不論是寫 open source
還是做一個給公司內部使用的框架
AOP 都將是不可或缺的技巧

這麼神，還不快用AOP重構你的程式碼!!!!!


