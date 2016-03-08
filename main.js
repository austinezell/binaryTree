"use strict";
const fs = require('fs')
const util = require('util')



let nums = [];
for (let i = 0; i<50; i++){
  let randomNum = Math.floor(Math.random()*50);
  if(nums.indexOf(randomNum) < 0) {
    nums.push(randomNum)
  }
}
nums.sort((a,b)=>a-b)

function* midPointGenerator(values){
  let k = 1;
  let midPoint = 1;
  while(midPoint > 0){
    midPoint = Math.floor(values.length/Math.pow(2,k++));
    yield midPoint;
  }
}

class Branch {
  constructor(value, left, right){
    this.value = value;
    this.left = left || null;
    this.right = right || null;
  }
}


class Tree {
  constructor(values){
    values.sort((a,b)=>a-b);
    this.array = values;
    let rootValue = values[Math.floor(values.length/2)];
    this._root = new Branch(rootValue);
    this.generateMidpoints("right");
    this.generateMidpoints("left");
    for (let value of values){
      let currentBranch = this._root;
      if (!this.contains(value)){
        let i = 0;
        while (currentBranch.value !== value){
          let direction = value < currentBranch.value
            ? "left"
              : "right";
          if (currentBranch[direction] === null){
            currentBranch[direction] = new Branch(value)
          }
          currentBranch = currentBranch[direction]
        }
      }
    }
    console.log(util.inspect(this._root, {showHidden: false, depth: null}));
  }

  generateMidpoints(direction){
    let midPoint = midPointGenerator(this.array);
    let index = midPoint.next().value;
    let currentBranch = this._root;
    while(index){
      index = midPoint.next().value;
      if(direction==="left"){
        currentBranch[direction] = new Branch(this.array[index]);
      } else currentBranch[direction] = new Branch(this.array[this.array.length - index -1])
      currentBranch = currentBranch[direction];
    }
  }


  contains(value){
    let isContains = false;
    let currentBranch = this._root;
    while (currentBranch){
      if(currentBranch.value === value) return true;
      currentBranch = value < currentBranch.value ? currentBranch.left : currentBranch.right
    }
    return false
  }
}

let tree = new Tree(nums)

console.log(tree);


// let i = 1;
// let count =(branch)=>{
//   i++
//   if(branch.left.value) {
//     count(branch.left)
//   }
//   if(branch.right.value){
//     count(branch.right)
//   }
// }
// count(tree);
// fs.writeFile('tree.json', JSON.stringify(tree), function(err){
//   console.log("hit");
// })
