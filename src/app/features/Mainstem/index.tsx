import DeleteIcon from '@/app/assets/icons/Delete';
import OpenIcon from '@/app/assets/icons/Open';
import { Spinner } from '@/app/assets/Spinner';
import Button from '@/app/components/common/Button';
import Collapsible from '@/app/components/common/Collapsible';
import IconButton from '@/app/components/common/IconButton';
import { Typography } from '@/app/components/common/Typography';
import { FancyList } from '@/app/components/FancyList';
import { useLoading } from '@/app/hooks/useLoading';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { EOverlay, setDatasets } from '@/lib/state/main/slice';
import { setSelected, setTarget } from '@/lib/state/mainstem/slice';
import { TMainstemRequest } from '@/lib/state/mainstem/types';
import { getDefaultGeojson } from '@/lib/state/utils';
import { Fragment } from 'react';

type TSummaryProps = {
    request: TMainstemRequest;
};

const MAX_SHOWN = 5;

export const Summary: React.FC<TSummaryProps> = ({ request }) => {
    const sections = [
        {
            label: 'Variables Measured',
            items: request.variables,
        },
        {
            label: 'Site Types',
            items: request.types,
        },
        {
            label: 'Distribution Names',
            items: request.distributionNames,
        },
    ].filter(({ items }) => items.length > 0);

    if (sections.length === 0) {
        return <Typography variant="body">Showing all datasets.</Typography>;
    }

    return (
        <div className="max-w-80">
            <Typography variant="body">
                <strong>Showing datasets based on:</strong>
            </Typography>

            <ul>
                {sections.map((section, index) => (
                    <Fragment key={section.label}>
                        {index > 0 && (
                            <li className="list-none text-center">
                                <Typography variant="body-small">
                                    <strong>AND</strong>
                                </Typography>
                            </li>
                        )}

                        <li>
                            <Typography variant="body-small" as="span">
                                <strong>{section.label}:</strong>{' '}
                                <FancyList
                                    items={section.items}
                                    max={MAX_SHOWN}
                                />
                            </Typography>
                        </li>
                    </Fragment>
                ))}
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
        dispatch(setTarget(selected));
    };

    const handleDeselect = () => {
        dispatch(setSelected(null));
        dispatch(setDatasets(getDefaultGeojson()));
    };

    const name = selected.name_at_outlet;
    const URI = selected.uri;

    const showSummary = selected && selected.id === request.id;

    return (
        <Collapsible
            className="bg-primary sm:min-w-[28rem] max-w-[90vw] shadow-md  rounded"
            buttonClassname="!border-none !bg-transparent"
            title={
                <div className="max-w-[63vw]">
                    <Typography
                        variant="h3"
                        className="flex-grow-0 !text-2xl text-left"
                    >
                        {name}
                    </Typography>
                    <Typography variant="body-small">{URI}</Typography>
                </div>
            }
            action={
                <IconButton
                    onClick={handleDeselect}
                    className={'w-12 h-auto fill-red-600'}
                    variant="transparent"
                >
                    <DeleteIcon />
                </IconButton>
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
