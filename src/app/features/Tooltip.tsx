type Props = {
    text: string;
    tabIndex: number;
    position?: 'left' | 'right' | 'top' | 'bottom';
    className?: string;
    children: React.ReactNode;
};

//** Add this to your global CSS file
// .tooltip:hover .tooltip-text {
//  visibility: visible;
// }
//  */

export const Tooltip: React.FC<Props> = (props) => {
    const { text, position = 'top', className = '' } = props;

    return (
        <div className={`tooltip ${className}`} tabIndex={0}>
            {props.children}
            <span className={`tooltip-text tooltip-${position}`}>{text}</span>
        </div>
    );
};
