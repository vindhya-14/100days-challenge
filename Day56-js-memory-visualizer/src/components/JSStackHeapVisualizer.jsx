import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JSStackHeapVisualizer() {
  const [stack, setStack] = useState([]);
  const [heap, setHeap] = useState({});
  const [step, setStep] = useState(0);

  const steps = [
    () => {
      setStack([{ name: "main", vars: {} }]);
    },
    () => {
      const newStack = [...stack];
      newStack[0].vars["x"] = 42;
      setStack(newStack);
    },
    () => {
      const newStack = [...stack];
      const heapObj = { id: "obj1", value: { name: "Alice" } };
      setHeap((prev) => ({ ...prev, [heapObj.id]: heapObj.value }));
      newStack[0].vars["person"] = heapObj.id;
      setStack(newStack);
    },
    () => {
      const newStack = [...stack, { name: "foo()", vars: {} }];
      setStack(newStack);
    },
    () => {
      const newStack = [...stack];
      const heapObj = { id: "obj2", value: [1, 2, 3] };
      setHeap((prev) => ({ ...prev, [heapObj.id]: heapObj.value }));
      newStack[newStack.length - 1].vars["arr"] = heapObj.id;
      setStack(newStack);
    },
    () => {
      const newStack = [...stack];
      newStack.pop();
      setStack(newStack);
    },
    () => {
      // Mark and sweep: only keep heap objects still referenced
      const reachable = new Set();
      stack.forEach((frame) => {
        Object.values(frame.vars).forEach((val) => reachable.add(val));
      });
      const newHeap = {};
      for (const ref of reachable) {
        if (heap[ref]) newHeap[ref] = heap[ref];
      }
      setHeap(newHeap);
    },
  ];

  const runStep = () => {
    if (step < steps.length) {
      steps[step]();
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStack([]);
    setHeap({});
    setStep(0);
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>JS Stack & Heap Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div>
              <h2 className="font-bold mb-2">Call Stack</h2>
              <div className="space-y-2">
                {stack.map((frame, idx) => (
                  <div
                    key={idx}
                    className="p-2 border rounded bg-gray-50 shadow-sm"
                  >
                    <strong>{frame.name}</strong>
                    <ul className="ml-4 list-disc">
                      {Object.entries(frame.vars).map(([k, v]) => (
                        <li key={k}>
                          {k}: {typeof v === "string" ? `ref->${v}` : v}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold mb-2">Heap</h2>
              <div className="space-y-2">
                {Object.entries(heap).map(([id, val]) => (
                  <div
                    key={id}
                    className="p-2 border rounded bg-green-50 shadow-sm"
                  >
                    <strong>{id}</strong>: {JSON.stringify(val)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={runStep} disabled={step >= steps.length}>
              Step
            </Button>
            <Button onClick={reset} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
