// src/utils/normalizationLogic.js
export function computeNormalizationSteps(parsed) {
  if (!parsed || !parsed.attributes) {
    return [{ title: "Error", description: "No parsed schema provided." }];
  }

  const name = parsed.name;
  const attrs = parsed.attributes.slice(); // copy

  // detect id-like attributes (case-insensitive endsWith 'id')
  const idAttrs = attrs.filter((a) => a.toLowerCase().endsWith("id"));

  // heuristic: if multiple id-like attributes AND there are 'line' attributes (quantity/price),
  // treat as a join/line-item relation with a composite key
  const lineHints = attrs.some((a) =>
    /quantity|qty|price|amount|line|total/i.test(a)
  );
  const isComposite = idAttrs.length >= 2 && lineHints;

  // choose a primary key heuristic
  const primaryKey = isComposite ? idAttrs.slice(0, 2) : idAttrs[0] || attrs[0];

  const steps = [];

  // Original relation
  steps.push({
    title: "Original Relation",
    description: `Original relation ${name} with attributes and a guessed primary key.`,
    relations: [`${name}(${attrs.join(", ")})`],
    examples: { guessedPrimaryKey: primaryKey },
  });

  // 1NF
  steps.push({
    title: "1NF (Atomicity)",
    description:
      "1NF requires that all attribute values are atomic (no repeating groups). This demo assumes attributes are atomic. If you have lists/repeating groups, split them into another relation.",
    relations: [`${name}(${attrs.join(", ")})`],
    notes: "No change required for typical flat schemas.",
  });

  // 2NF
  if (isComposite) {
    // composite key decomposition example: keep composite key as core, move non-key attributes to details
    const composite = idAttrs.slice(0, 2); // take first two ids
    const nonKeyAttrs = attrs.filter((a) => !composite.includes(a));
    const core = `${name}_core(${composite.join(", ")})`;
    const details = `${name}_details(${composite.join(
      ", "
    )}, ${nonKeyAttrs.join(", ")})`;
    steps.push({
      title: "2NF (Remove partial dependencies)",
      description: `Detected likely composite key [${composite.join(
        ", "
      )}]. Move attributes that depend on the full composite key into a details relation to remove partial dependencies.`,
      relations: [core, details],
    });
  } else {
    // no composite key detected -> no 2NF change
    steps.push({
      title: "2NF (Remove partial dependencies)",
      description:
        "No composite primary key detected, so partial dependencies are unlikely. If you have a composite key in reality, specify it through FDs.",
      relations: [`${name}(${attrs.join(", ")})`],
      notes: "You can enter FDs later for more accurate decomposition.",
    });
  }

  // 3NF: look for transitive dependency patterns like CustomerName depends on CustomerId
  const thirdRelations = [];
  const nameAttrs = attrs.filter((a) => /name$/i.test(a));
  const removedFromMain = new Set();

  nameAttrs.forEach((n) => {
    const prefix = n.replace(/Name$/i, "");
    const idCandidate = attrs.find(
      (a) => a.toLowerCase() === `${prefix.toLowerCase()}id`
    );
    if (idCandidate) {
      // create separate relation (e.g., Customer(customerId, customerName))
      const relName = prefix || "X";
      const rel = `${relName}(${idCandidate}, ${n})`;
      thirdRelations.push(rel);
      removedFromMain.add(n);
    }
  });

  // remaining attributes for the main relation after extracting name-based relations
  const remaining = attrs.filter((a) => !removedFromMain.has(a));
  // if we decomposed for 2NF, show the previously produced relations as starting point
  if (isComposite) {
    // the 2NF relations were: core and details; apply 3NF extraction on details
    const composite = idAttrs.slice(0, 2);
    const nonKeyAttrs = attrs.filter(
      (a) => !composite.includes(a) && !removedFromMain.has(a)
    );
    const core = `${name}_core(${composite.join(", ")})`;
    const details = `${name}_details(${composite.join(
      ", "
    )}, ${nonKeyAttrs.join(", ")})`;
    const finalList = [core, details, ...thirdRelations];
    steps.push({
      title: "3NF (Remove transitive dependencies)",
      description:
        "Extracted small relations for attributes that were transitively dependent (e.g., XName depends on XId).",
      relations: finalList,
    });
  } else {
    const finalMain = `${name}(${remaining.join(", ")})`;
    const finalList = [finalMain, ...thirdRelations];
    steps.push({
      title: "3NF (Remove transitive dependencies)",
      description:
        "Extracted relations for transitive dependencies (e.g., CustomerName depends on CustomerId).",
      relations: finalList,
    });
  }

  // BCNF (informational)
  steps.push({
    title: "BCNF (Boyce–Codd Normal Form)",
    description:
      "BCNF requires every determinant to be a candidate key. Automated BCNF decomposition requires explicit functional dependencies (FDs). If you provide FDs, the tool can compute candidate keys and decompose to BCNF.",
    relations: steps[steps.length - 1].relations,
    notes:
      "To continue to BCNF automatically, add Functional Dependencies in the next UI step.",
  });

  return steps;
}
