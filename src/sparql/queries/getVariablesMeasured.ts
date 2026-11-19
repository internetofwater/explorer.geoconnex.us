import { VIEW_PREFIX } from '@/sparql/queries/consts';
import { TBasicOptions, TMainstemQuery } from '@/sparql/queries/types';
import { format } from '@/sparql/queries/utils/format';
import * as z from 'zod';

export type TRawGetVariablesMeasured = {
    datasets: string;
    variableMeasured: string;
};

export const VariablesMeasured = z.array(
    z.object({
        datasets: z.coerce.number(),
        variableMeasured: z.string(),
    })
);

export type TVariablesMeasured = z.infer<typeof VariablesMeasured>;

// This field is used to query elsewhere, keeping naming consistent
export const VARIABLE_MEASURED_URI = 'variableMeasuredURI';

// Reads from the `explorer-variable-counts` QLever materialized view
const build = (uri: string, options: TBasicOptions = { prefix: true }) =>
    format(`
            ${options.prefix !== false ? VIEW_PREFIX : ''}

            SELECT ?variableMeasured ?datasets
            WHERE {
                SERVICE view:explorer-variable-counts {
                    [
                        view:column-mainstem <${uri}> ;
                        view:column-variableMeasured ?variableMeasured ;
                        view:column-datasets ?datasets
                    ]
                }
            }
            ORDER BY DESC(?datasets)`);

export const getVariablesMeasured: TMainstemQuery = Object.assign(build, {
    example: () => build('https://geoconnex.us/ref/mainstems/1'),
});
