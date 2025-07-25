export class CommandHistory {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  executeCommand(command) {
    this.undoStack.push(command);
    command.execute();
    this.redoStack = []; // clear redo after new action
  }

  undo(ctx, clearFn) {
    if (this.undoStack.length === 0) return;
    const cmd = this.undoStack.pop();
    this.redoStack.push(cmd);
    clearFn(); // clear canvas
    this.undoStack.forEach(c => c.execute()); // re-render
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const cmd = this.redoStack.pop();
    this.undoStack.push(cmd);
    cmd.execute();
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
