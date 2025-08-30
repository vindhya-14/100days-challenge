export function bankersAlgorithm(processes, available) {
  const n = processes.length;
  const m = available.length;

  let work = [...available];
  let finish = Array(n).fill(false);
  let safeSequence = [];

  let need = processes.map((p) =>
    p.max.map((maxVal, j) => maxVal - p.allocation[j])
  );

  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    for (let i = 0; i < n; i++) {
      if (!finish[i] && need[i].every((val, j) => val <= work[j])) {
        work = work.map((w, j) => w + processes[i].allocation[j]);
        safeSequence.push(processes[i].id);
        finish[i] = true;
        madeProgress = true;
      }
    }
  }

  const deadlock = finish.includes(false);
  return { safeSequence, deadlock };
}
