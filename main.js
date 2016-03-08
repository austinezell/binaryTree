"use strict";
const util = require('util')

let nums = [];

for (let i = 0; i<50; i++){
  let randomNum = Math.floor(Math.random()*100);
  if(nums.indexOf(randomNum) < 0) {
    nums.push(randomNum);
  }
}

class Branch {
  constructor(value){
    this.value = value;
    this.left = null;
    this.right = null;
  }
  nextDirection(value){
    return value > this.value ? "right" : "left"
  }
}

class BinaryTree {
  constructor(values){
    values = Array.from(values);
    values.sort((a,b)=>a-b);
    let rootValue = values[Math.floor(values.length/2)];
    // creates top node
    this._root = new Branch(rootValue);
    //generates halfway points for all other values to fall in between
    this.generateMidPoints("right", values);
    this.generateMidPoints("left", values);
    // adds remaining values
    for (let value of values){
      this.addValue(value);
    }
  }

  addValue(value){
    if (!this.contains(value)){
      let currentBranch = this._root;
      while (currentBranch.value !== value){
        let direction = currentBranch.nextDirection(value);
        if (currentBranch[direction] === null){
          //generates new branch in direction
          currentBranch[direction] = new Branch(value);
        }
        currentBranch = currentBranch[direction];
      }
    }
    // console.log(util.inspect(this._root, {showHidden: false, depth: null}));
  }

  toArray(){
    function getValue(branch){
      let values = [];
      values.push(branch.value);
      if (branch.left && branch.right) {
        return values.concat(getValue(branch.left)).concat(getValue(branch.right));
      }
      if (branch.right) return values.concat(getValue(branch.right));
      if (branch.left) return values.concat(getValue(branch.left));
      return values;
    }
    return getValue(this._root).sort((a,b)=>a-b);
  }

  sum(){
    return this.toArray().reduce((a,b)=>a+b);
  }

  generateMidPoints(direction, values){
    let k =1;
    let midPoint = Math.floor(values.length/Math.pow(2,k++));
    let currentBranch = this._root;
    while(midPoint){
      midPoint = Math.floor(values.length/Math.pow(2,k++));
      if(direction==="left"){
        currentBranch[direction] = new Branch(values[midPoint]);
      } else currentBranch[direction] = new Branch(values[values.length - midPoint -1]);
      currentBranch = currentBranch[direction];
    }
  }

  contains(value){
    let currentBranch = this._root;
    while (currentBranch){
      if(currentBranch.value === value) return true;
      currentBranch = value < currentBranch.value ? currentBranch.left : currentBranch.right
    }
    return false
  }
}

let tree = new BinaryTree(nums)
