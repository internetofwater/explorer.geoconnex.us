import OpenIcon from '@/app/assets/icons/Open';
import { Spinner } from '@/app/assets/Spinner';
import Button from '@/app/components/common/Button';
import Collapsible from '@/app/components/common/Collapsible';
import { Typography } from '@/app/components/common/Typography';
import { useLoading } from '@/app/hooks/useLoading';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { EOverlay, setOverlay } from '@/lib/state/main/slice';
import { TMainstemRequest } from '@/lib/state/mainstem/types';

type TSummaryProps = {
    request: TMainstemRequest;
};

type TShowMoreProps = {
    count: number;
};

const ShowMoreBadge: React.FC<TShowMoreProps> = (props) => {
    const { count } = props;

    return ` + ${count} more`;
};

const Summary: React.FC<TSummaryProps> = (props) => {
    const { request } = props;

    const listFormatOptions = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
    });
    const MAX_SHOWN = 5;

    const hasVariables = request.variables.length > 0;
    const hasTypes = request.types.length > 0;

    if (!hasVariables && !hasTypes) {
        return <Typography variant="body">Showing all datasets.</Typography>;
    }

    return (
        <div className="max-w-64">
            <Typography variant="body">
                <strong>Showing datasets based on:</strong>
            </Typography>
            <ul>
                {hasVariables && (
                    <li>
                        <Typography variant="body-small" as="span">
                            <strong>Variables Measured:</strong>{' '}
                            {listFormatOptions.format(
                                request.variables.slice(0, MAX_SHOWN)
                            )}
                            {request.variables.length > MAX_SHOWN && (
                                <ShowMoreBadge
                                    count={request.variables.length - MAX_SHOWN}
                                />
                            )}
                        </Typography>
                        <br />
                    </li>
                )}
                {hasTypes && (
                    <li>
                        <Typography variant="body-small" as="span">
                            <strong>Site Types:</strong>{' '}
                            {listFormatOptions.format(
                                request.types.slice(0, MAX_SHOWN)
                            )}
                            {request.types.length > MAX_SHOWN && (
                                <ShowMoreBadge
                                    count={request.types.length - MAX_SHOWN}
                                />
                            )}
                        </Typography>
                    </li>
                )}
            </ul>
        </div>
    );
};

const Mainstem: React.FC = () => {
    const selected = useAppSelector((state) => state.mainstem.selected);
    const overlay = useAppSelector((state) => state.main.overlay);
    const request = useAppSelector((state) => state.mainstem.request);

    const dispatch = useAppDispatch();

    const { isFetchingMainstemDatasets } = useLoading();

    if (!selected) {
        return null;
    }

    const handleClick = () => {
        if (overlay !== EOverlay.Mainstem) {
            dispatch(setOverlay(EOverlay.Mainstem));
        }
    };

    const name = selected.name_at_outlet;
    const URI = selected.uri;

    const showSummary = selected && selected.id === request.id;

    return (
        <Collapsible
            className="bg-primary min-w-[28rem] shadow-md  rounded"
            buttonClassname="!border-none !bg-transparent"
            title={
                <div>
                    <Typography variant="h3">{name}</Typography>
                    <Typography variant="body-small">{URI}</Typography>
                </div>
            }
        >
            <div className="flex flex-row justify-between p-2 items-end">
                {showSummary && (
                    <>
                        {isFetchingMainstemDatasets ? (
                            <Spinner />
                        ) : (
                            <Summary request={request} />
                        )}
                    </>
                )}
                <Button
                    title={`Open dataset retrieval menu for: ${name}`}
                    onClick={handleClick}
                    disabled={overlay === EOverlay.Mainstem}
                    className="flex flex-row justify-between items-center gap-2 ml-auto"
                >
                    Update <OpenIcon className="w-5 h-5" />
                </Button>
            </div>
        </Collapsible>
    );
};

export default Mainstem;
