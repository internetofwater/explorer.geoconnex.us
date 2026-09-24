import dedent from 'dedent';

/**
 * Applies any formatting needed for consistent and readable query printing
 *
 * @param {string} str - Query template literal
 * @returns query with all expected formatting applied
 */
export const format = (str: string) => dedent(str);
