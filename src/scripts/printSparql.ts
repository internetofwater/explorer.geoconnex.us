/**
 * Copyright 2026 Lincoln Institute of Land Policy
 * SPDX-License-Identifier: Apache-2.0
 */

import Queries from '@/queries';

for (const [name, query] of Object.entries(Queries)) {
    console.log('='.repeat(80));
    console.log(name);
    console.log('='.repeat(80));
    console.log(query.example());
    console.log();
}
