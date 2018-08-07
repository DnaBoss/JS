function binarySearch(target, arr) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let mid = parseInt(start + (end - start) / 2);
        return target == arr[mid] ? mid : target > arr[mid] ? start = mid + 1 : end = mid - 1;
    }
    return undefined;
}
