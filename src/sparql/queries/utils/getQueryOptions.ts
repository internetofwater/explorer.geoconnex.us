import { TQueryOptions } from '@/sparql/queries/types';

export const getQueryOptions = (options: TQueryOptions) => `
     ${
         options.variables && options.variables.length > 0
             ? `
                VALUES ?variableMeasured { 
                    ${options.variables.map((v) => `"${v}"`).join('\n')}\n 
                }`
             : ''
     }
     ${
         options.types && options.types.length > 0
             ? `
                VALUES ?type { 
                    ${options.types.map((t) => `"${t}"`).join('\n')} 
                }`
             : ''
     }
    `;
