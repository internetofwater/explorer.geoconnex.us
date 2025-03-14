import RightArrow from '@/app/assets/icons/RightArrow';
import React, { useState } from 'react';

type Props = {
    title: string;
    open?: boolean;
    noPadding?: boolean;
    children: React.ReactNode;
};

const Collapsible: React.FC<Props> = (props) => {
    const { title, open = false, noPadding } = props;

    const [isOpen, setIsOpen] = useState(open);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-primary  text-black ">
            <button
                title={`${isOpen ? 'Hide' : 'Show'} ${title}`}
                className={`sticky top-0 w-full 
                        flex justify-between items-center p-4 bg-primary-opaque 
                        font-bold text-lg 
                        border-t ${isOpen && 'border-b'} border-gray-300
                        hover:bg-primary-opaque-hover focus:bg-primary-opaque-hover`}
                onClick={toggleCollapse}
            >
                {title}
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
