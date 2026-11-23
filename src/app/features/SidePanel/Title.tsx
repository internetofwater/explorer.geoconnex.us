import Image from 'next/image';
import { Typography } from '@/app/components/common/Typography';
import { MODE, TMode } from '@/lib/state/main/slice';

type Props = {
    mode: TMode;
};

export const Title: React.FC<Props> = (props) => {
    const { mode } = props;

    return (
        <div className="ml-4 flex items-center gap-x-4 h-16">
            <a
                href="https://internetofwater.org/"
                aria-label="Link to Internet of Water site"
                target="_blank"
            >
                <Image
                    src={'/IoWCoalitionLogoMark.png'}
                    alt="Internet of Water Logo"
                    width={35}
                    height={50}
                />
            </a>
            <div className="flex flex-col gap-0">
                <Typography variant="h3" as="h1">
                    Geoconnex Explorer
                </Typography>
                <Typography
                    variant="h4"
                    as="h2"
                    className="!text-[--text-secondary-color]"
                >
                    {mode === MODE.RiverRunner ? 'River Runner' : 'Mainstems'}
                </Typography>
            </div>
        </div>
    );
};
