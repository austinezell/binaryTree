"use strict";
const util = require('util')

class Branch {
  constructor(value, parent, left, right){
    this._value = value;
    this._parent = parent;
    this._left = left || null;
    this._right = right || null;
  }
  setChild(node, direction){
    this[direction] = node;
  }
  getParent(){
    return this._parent;
  }
  traverseNext(value){
    return value < this._value ?
    {
      node: this._left,
      direction: "_left"
    } : {
      node: this._right,
      direction: "_right"
    }
  }
}

class BinaryTree {
  constructor(value){
    if (Array.isArray(value) || arguments.length > 1){
      let values = Array.isArray(value) ? value : Array.from(arguments);
      this.constructFromDataSet(values)
    }
    else if (value){
      this._root = new Branch(value);
    } else this._root = null;
  }
  constructFromDataSet(values){
    let rootValue = values[Math.floor(values.length/2)];
    this._root = new Branch(rootValue);
    this.generateMidPoints("_right", values);
    this.generateMidPoints("_left", values);
    for(let value of values){
      this.addValue(value)
    }
  }
  generateMidPoints(direction, values){
    let sortedValues = Array.prototype.slice.call(values).sort((a,b)=>a-b)
    let k =1;
    let midPoint = Math.floor(sortedValues.length/Math.pow(2,k++));
    let currentBranch = this._root;
    while(midPoint){
      midPoint = Math.floor(sortedValues.length/Math.pow(2,k++));
      let directionalMidpoint = direction === "_left" ? midPoint : sortedValues.length - midPoint -1
      let newChild = new Branch(sortedValues[directionalMidpoint], currentBranch)
      currentBranch.setChild(newChild, direction);
      currentBranch = newChild;
    }
  }

  addValue(value){
    if (this.contains(value)) return;
    if (this._root === null) return this._root = new Branch(value)
    let currentBranch = this._root;
    while (currentBranch._value !== value){
      let next = currentBranch.traverseNext(value);
      if (next.node === null){
        next.node = new Branch(value, currentBranch);
        currentBranch.setChild(next.node, next.direction)
        break;
      }
      currentBranch = next.node;
    }
  }
  toArray(){
    return (function getValue(branch){
      let values = [];
      values.push(branch._value);
      if (branch._left && branch._right) {
        return values.concat(getValue(branch._left)).concat(getValue(branch._right));
      }
      if (branch._right) return values.concat(getValue(branch._right));
      if (branch._left) return values.concat(getValue(branch._left));
      return values;
    })(this._root)
  }
  sum(){
    return this.toArray().reduce((a,b)=>a+b);
  }
  contains(value){
    let currentBranch = this._root;
    while (currentBranch){
      if(currentBranch._value === value) return true;
      currentBranch = currentBranch.traverseNext(value).node
    }
    return false
  }
  minimum(){
    let currentBranch = this._root;
    while(currentBranch._left){
      currentBranch = currentBranch._left;
    }
    return currentBranch._value
  }
  maximum(){
    let currentBranch = this._root;
    while(currentBranch._right){
      currentBranch = currentBranch._right;
    }
    return currentBranch._value
  }
}

let tree1 = new BinaryTree()
let nums =  [];
let pushNums = false;
for (let i = 0; i<400; i++){
  let randomNum = Math.floor(Math.random()*400) - 200;
  pushNums ? nums.push(randomNum) : tree1.addValue(randomNum)
  pushNums = !pushNums
}
let tree2 = new BinaryTree(nums)

// console.log(util.inspect(tree1, {showHidden: false, depth: null}));
// console.log(util.inspect(tree2, {showHidden: false, depth: null}));
