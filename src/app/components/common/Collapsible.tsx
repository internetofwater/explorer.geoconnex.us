import RightArrow from '@/app/assets/icons/RightArrow';
import React, { useEffect, useState } from 'react';
import { Typography } from '@/app/components/common/Typography';

type Props = {
    title: string;
    open?: boolean;
    children: React.ReactNode;
};

/**
 * Renders a collapsible section with a title that can be toggled open or closed.
 * It supports an initial open state and handles state changes to show or hide the content.
 *
 * Props:
 * - title: string - The title of the collapsible section.
 * - open?: boolean - Optional boolean to set the initial open state (default is false) and
 *  programmatically close/open the collapsible.
 * - children: React.ReactNode - The content to be rendered within the collapsible section.
 *
 * @component
 */
const Collapsible: React.FC<Props> = (props) => {
    const { title, open = false } = props;

    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-primary text-black ">
            <button
                title={`${isOpen ? 'Hide' : 'Show'} ${title}`}
                className={`sticky top-0 w-full -mt-1
                        flex justify-between items-center p-4 bg-primary-opaque 
                        border-t ${isOpen ? 'border-b' : ''} border-gray-300
                        hover:bg-primary-opaque-hover focus:bg-primary-opaque-hover
                        z-[2]`}
                onClick={toggleCollapse}
            >
                <Typography
                    variant="h3"
                    as="h2"
                    className="flex-grow-0 text-left"
                >
                    {title}
                </Typography>
                <span
                    data-testid="arrow-icon-wrapper"
                    className={`transform ${
                        isOpen ? '-rotate-90' : 'rotate-90'
                    }`}
                >
                    <RightArrow />
                </span>
            </button>
            <div
                data-testid="collapsible-content"
                className={`overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
            >
                {props.children}
            </div>
        </div>
    );
};

export default Collapsible;
