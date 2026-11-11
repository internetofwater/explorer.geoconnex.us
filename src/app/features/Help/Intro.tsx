import { Typography } from '@/app/components/common/Typography';
import { getHelpSections } from '@/app/features/Help/utils';
import { INTRO_CONTENT } from '@/app/features/Help/consts';

export const Intro: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 pl-4 pr-2 mt-4 mb-2">
            {getHelpSections(INTRO_CONTENT).map((section) => (
                <div key={section.title} className="flex flex-col gap-2">
                    <Typography variant="h3" className="mt-2">
                        {section.title}
                    </Typography>

                    {section.items && (
                        <div className="flex flex-col gap-2">
                            {section.items.map((item, index) => (
                                <Typography
                                    key={`${section.title}-item-${index}`}
                                    variant="body"
                                >
                                    {item}
                                </Typography>
                            ))}
                        </div>
                    )}

                    {section.content && (
                        <Typography variant="body">
                            {section.content}
                        </Typography>
                    )}
                </div>
            ))}
        </div>
    );
};
