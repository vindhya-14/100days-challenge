export class DecisionStump {
  constructor() {
    this.feature = null;
    this.threshold = null;
    this.leftClass = null;
    this.rightClass = null;
  }

  train(X, y) {
    let bestError = Infinity;
    for (let f = 0; f < X[0].length; f++) {
      for (let t = -1; t <= 1; t += 0.1) {
        let leftY = [],
          rightY = [];
        for (let i = 0; i < X.length; i++) {
          if (X[i][f] < t) leftY.push(y[i]);
          else rightY.push(y[i]);
        }
        let leftClass = majority(leftY);
        let rightClass = majority(rightY);
        let error = 0;
        for (let i = 0; i < X.length; i++) {
          let pred = X[i][f] < t ? leftClass : rightClass;
          if (pred !== y[i]) error++;
        }
        if (error < bestError) {
          bestError = error;
          this.feature = f;
          this.threshold = t;
          this.leftClass = leftClass;
          this.rightClass = rightClass;
        }
      }
    }
  }

  predict(x) {
    return x[this.feature] < this.threshold ? this.leftClass : this.rightClass;
  }
}

function majority(arr) {
  if (arr.length === 0) return 1;
  let pos = arr.filter((v) => v === 1).length;
  let neg = arr.length - pos;
  return pos >= neg ? 1 : -1;
}
