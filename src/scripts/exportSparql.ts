/**
 * Copyright 2026 Lincoln Institute of Land Policy
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Writes the example SPARQL statement for every registered query to a JSON
 * file so downstream consumers can test the statements for regressions.
 *
 * Usage: tsx src/scripts/exportSparql.ts [outputPath]
 */

import { writeFileSync } from 'node:fs';
import Queries from '@/sparql/queries';

// output to sparql-queries.json unless another file is specified
const outputPath = process.argv[2] ?? 'sparql-queries.json';

const queries = Object.fromEntries(
    Object.entries(Queries)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, query]) => [name, query.example()])
);

writeFileSync(outputPath, JSON.stringify(queries, null, 4) + '\n');

console.log(
    `Wrote ${Object.keys(queries).length} SPARQL statements to ${outputPath}`
);
