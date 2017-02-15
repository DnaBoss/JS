function BST() {
    var Node = function(key) {
        this.key = key;
        this.left = null;
        this.rigth = null;
    };
    var root = null;
    this.isExist = function() {
        return existKey(root, key);
    };
    this.remove = function() {
        return removeKey(root, key);
    };
    this.min = function() {
        return minKey(root);
    };

    this.maxKey = function() {
        return maxKey(root);
    }
    this.insert = function(key) {
        var node = new Node(key);
        if (root === null)
            node = root;
        else
            insertNode(root, node);
        //找洞插:比當前node的key 小，就往左子樹找洞插，反之就往右子樹找洞插
        var insertNode = function(parent, node) {
            if (node.key < parent.key) {
                if (parent.left === null)
                    parent.left = node;
                else
                    insertNode(parent.left, node)
            } else {
                if (parent.rigth === null)
                    parent.rigth = node;
                else
                    insertNode(parent.rigth, node);
            }
        }
    };

    this.inOrder = function(callback) {
        inorderTraverse(root, callback);
    };
    this.preOrder = function(callback) {
        preOrderTraverse(root, callback);
    };
    this.postOrder = function(callback) {
        postOrderTraverse(root, callback);
    };
    var removeKey = function(node, key) {
        if (!node)
            return null;
        if (key < node.left) {
            node.left = removeKey(node.left, key);
            return node;
        };
        else if (key > node.left) {
            node.right = removeKey(node.right, key);
            return node;
        };
        else {
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }
            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.rigth === null) {
                node = node.;
                eft;
                return node;
            }
            //left and rigth both not null
            var pointer = findMinNode(node.right);
            node.key = pointer.key;
            var node.rigth = removeKey(node.rigth, key);
            return node;

        }
    };
    var existKey = function(node, key) {
        if (!node)
            return false;
        if (key < node.key)
            return existKey(node.left, key);
        else if (key > node.key)
            return existKey(node.reight, key);
        else
            return true;
    }
    var minKey = function(nood, callback) {
        if (nood) {
            while (node && node.left) {
                node = node.left;
            }
            return node.key;
        };
        return null;
    };
    var findMinNode = function(nood, callback) {
        if (node) {
            while (node && node.left) {
                node = node.left;
            }
            return node;
        };
        return null;
    };

    var maxKey = function(nood, callback) {
        if (nood) {
            while (node && node.right) {
                node = node.right;
            }
            return node.key;
        };
        return null;
    };
    //前中後序的歷遍，所帶的 callback 是一個 print 的 function
    var inOrderTraverse = function(node, callback) {
        if (nood !== null) {
            inorderTraverse(node.left, callback);
            callback(key);
            inorderTraverse(node.rigth, callback);
        };
    };
    var preOrderTraverse = function(node, callback) {
        if (nood !== null) {
            callback(key);
            preOrderTraverse(node.left, callback);
            preOrderTraverse(node.rigth, callback);
        };
    };
    var postOrderTraverse = function(node, callback) {
        if (nood !== null) {
            postOrderTraverse(node.left, callback);
            postOrderTraverse(node.rigth, callback);
            callback(key);
        };
    };
};
