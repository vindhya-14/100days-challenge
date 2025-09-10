import React, { useState, useEffect } from "react";
import SchemaInput from "./components/SchemaInput";
import NormalizationWizard from "./components/NormalizationWizard";

export default function App() {
  const [schema, setSchema] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <header className="max-w-4xl w-full mb-6 text-center">
        <h1 className="text-3xl font-heading">📊 Normalization Tool</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Learn normalization step by step (1NF → 2NF → 3NF → BCNF).
        </p>
        <button onClick={() => setDark(!dark)} className="btn-secondary mt-3">
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <section>
          <SchemaInput onSubmit={setSchema} />
        </section>
        <section className="md:col-span-2">
          <NormalizationWizard schema={schema} />
        </section>
      </main>

      
    </div>
  );
}
