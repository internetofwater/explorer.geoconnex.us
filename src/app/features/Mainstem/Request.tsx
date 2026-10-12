import { Typography } from '@/app/components/common/Typography';
import { FancyList } from '@/app/components/FancyList';
import { TMainstemRequest } from '@/lib/state/mainstem/types';
import { Fragment, useMemo } from 'react';

type EntryProps = {
    title: string;
    items: string[];
};

const Entry: React.FC<EntryProps> = (props) => {
    const { title, items } = props;

    const MAX_SHOWN = 5;

    return (
        <li className="list-disc break-words whitespace-normal">
            <Typography variant="body-small">
                <strong>{title}:</strong>{' '}
                <FancyList items={items} max={MAX_SHOWN} />
            </Typography>
        </li>
    );
};

type Props = {
    request: TMainstemRequest;
};

export const Request: React.FC<Props> = (props) => {
    const { request } = props;

    const entries = useMemo(() => {
        const entries = [];

        if (request.variables.length > 0) {
            entries.push(
                <Entry title="Variables Measured" items={request.variables} />
            );
        }
        if (request.types.length > 0) {
            entries.push(<Entry title="Site Types" items={request.types} />);
        }
        if (request.distributionNames.length > 0) {
            entries.push(
                <Entry
                    title="Distribution Names"
                    items={request.distributionNames}
                />
            );
        }

        return entries;
    }, [request]);

    if (entries.length === 0) {
        return (
            <>
                <Typography variant="body">
                    Fetching all datasets connected to this mainstem.
                </Typography>
                <Typography variant="body-small">
                    Select options to the left to improve your search.
                </Typography>
            </>
        );
    }

    return (
        <>
            <Typography variant="body">Fetching datasets based on:</Typography>
            <ul className="pl-5">
                {entries.map((entry, index) => (
                    <Fragment key={`mainstem-request-summary-${index}`}>
                        {index > 0 && (
                            <div className="w-full text-center py-1">
                                <Typography variant="body">
                                    <strong>AND</strong>
                                </Typography>
                            </div>
                        )}
                        {entry}
                    </Fragment>
                ))}
            </ul>
        </>
    );
};
