import { DESELECT_ALL_VALUE, SELECT_ALL_VALUE } from '.';
import { TOption } from './types';

export const getSelectAllOption = (
    areAllSelected: boolean = false
): TOption<string> => ({
    value: areAllSelected ? DESELECT_ALL_VALUE : SELECT_ALL_VALUE,
    label: areAllSelected ? 'Deselect all' : 'Select all',
});
