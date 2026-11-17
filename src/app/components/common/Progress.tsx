type Props = {
    percentage: number;
    background?: string;
    foreground?: string;
    orientation?: 'horizontal' | 'vertical';
};

export const ProgressBar: React.FC<Props> = (props) => {
    const {
        percentage,
        background = '#e5e7eb',
        foreground = 'var(--tertiary)',
        orientation = 'horizontal',
    } = props;

    const classes =
        orientation === 'horizontal'
            ? {
                  background: 'h-2 w-full',
                  foreground: 'h-full w-full origin-left',
                  function: 'scaleX',
              }
            : {
                  background: 'h-full w-2',
                  foreground: 'h-full w-full origin-top',
                  function: 'scaleY',
              };

    return (
        <div
            className={`${classes.background} overflow-hidden rounded-full`}
            style={{ backgroundColor: background }}
        >
            <div
                className={`${classes.foreground} transition-transform duration-75 ease-linear`}
                style={{
                    backgroundColor: foreground,
                    transform: `${classes.function}(${Math.min(1, percentage)})`,
                }}
            />
        </div>
    );
};
