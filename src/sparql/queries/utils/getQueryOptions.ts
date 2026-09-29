import { VARIABLE_MEASURED_URI } from '../getVariablesMeasured';
import { TOptions } from '../types';
import { format } from './format';

export const getQueryOptions = (options: TOptions) =>
    format(`
     ${
         options.variableMeasuredURIs && options.variableMeasuredURIs.length > 0
             ? `
                VALUES ?${VARIABLE_MEASURED_URI} { 
                    ${options.variableMeasuredURIs.map((uri) => `<${uri}>`).join('\n')}\n 
                }`
             : ''
     }
     ${
         options.types && options.types.length > 0
             ? `VALUES ?type { ${options.types.map((t) => `<${t}>`).join(' ')} }`
             : ''
     }
    `);
