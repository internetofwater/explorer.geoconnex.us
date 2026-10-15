import { TTypes } from '@/sparql/queries/getTypes';

export const isTypes = (obj: unknown): obj is TTypes => {
    return Array.isArray(obj) && (obj.length === 0 || 'types' in obj[0]);
};
