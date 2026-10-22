import { THelpSection } from '@/app/features/Help/consts';

export const getHelpSections = (
    object: Record<string, THelpSection>
): THelpSection[] => Object.values(object);
