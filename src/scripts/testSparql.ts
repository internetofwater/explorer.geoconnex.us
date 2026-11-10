/**
 * Copyright 2026 Lincoln Institute of Land Policy
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Runs the example SPARQL statement for every registered query against the
 * graph endpoint and fails if any query returns a bad status or no results.
 *
 * Usage: tsx src/scripts/testSparql.ts
 *
 * Set SPARQL_ENDPOINT to test against an endpoint other than GRAPH_SOURCE.
 */

import Queries from '@/sparql/queries';
import {
    SPARQL_HEADER_ACCEPT,
    SPARQL_HEADER_CONTENT_TYPE,
} from '@/services/dataset.service';
import { GRAPH_SOURCE } from '@/services/init/init';

// set `SPARQL_ENDPOINT` if you want to test the queries against
// a different graph
const endpoint = process.env.SPARQL_ENDPOINT ?? GRAPH_SOURCE;

// need to use async in a function since no top level await
const main = async () => {
    let failed = false;

    for (const [name, query] of Object.entries(Queries)) {
        const start = Date.now();
        const elapsed = () => `${((Date.now() - start) / 1000).toFixed(1)}s`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': SPARQL_HEADER_CONTENT_TYPE,
                Accept: SPARQL_HEADER_ACCEPT,
            },
            body: query.example(),
        });

        if (!response.ok) {
            console.error(
                `❌ ${name}: HTTP ${response.status} in ${elapsed()}`
            );
            failed = true;
            // if the query failed, we still continue since
            // we want to see the behavior of the other queries
            continue;
        }

        const { results } = await response.json();
        const rows: Record<string, { value: string }>[] = results.bindings;

        // check the special case for COUNT; in a COUNT query, there is always
        // at least one row; if the count value was 0, then it should be a failure
        const isZeroCount =
            rows.length === 1 &&
            Object.values(rows[0]).every(({ value }) => value === '0');

        if (rows.length === 0 || isZeroCount) {
            console.error(`❌ ${name}: no results in ${elapsed()}`);
            failed = true;
            continue;
        }

        console.log(`✅ ${name}: ${rows.length} row(s) in ${elapsed()}`);
    }

    process.exit(failed ? 1 : 0);
};

void main();
