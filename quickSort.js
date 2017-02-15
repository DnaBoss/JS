var quickSort = function(arr) {　　
    if (arr.length <= 1) return arr;　
    //把取中間的數為基數
    var pivotIndex = Math.floor(arr.length / 2);　　
    //把基本單獨拿出來
    var pivot = arr.splice(pivotIndex, 1)[0];　　
    var left = [];　　
    var right = [];
    //比基數小的就放左陣列，比基數大的放右陣列
    arr.map(num => num < pivot ? left.push(num) : right.push(num))
    //排序過的左陣列+基數+排序過的右陣列
    return quickSort(left).concat([pivot], quickSort(right));
};


function randomNums(minNum,maxNum) {
    var list = [];
    for (var i = 0; i < 10; i++) {
        list.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum)
    }
    return list;
}
//產生一個0~100的數列，裡面有10個數字
var nums = randomNums(0,100);
//做排序
var ans = quickSort(nums)
//簡單的寫個測試，每一個數字都小於等於下一個數字
var test = ans.every((num, index, arr) => num <= arr[index])
