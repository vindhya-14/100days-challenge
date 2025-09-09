export class Perceptron {
  constructor(dim = 2, lr = 0.1) {
    this.lr = lr;
    this.weights = Array(dim + 1).fill(0);
  }

  predict(x) {
    let sum = this.weights[0]; // bias
    for (let i = 0; i < x.length; i++) sum += this.weights[i + 1] * x[i];
    return sum >= 0 ? 1 : -1;
  }

  train(X, y, epochs = 10) {
    for (let e = 0; e < epochs; e++) {
      for (let i = 0; i < X.length; i++) {
        let pred = this.predict(X[i]);
        let error = y[i] - pred;
        this.weights[0] += this.lr * error;
        for (let j = 0; j < X[i].length; j++) {
          this.weights[j + 1] += this.lr * error * X[i][j];
        }
      }
    }
  }
}
