import HelpIcon from '@/app/assets/icons/Help';
import { ReactNode } from 'react';

export type THelpSection = {
    title: string;
    items?: ReactNode[];
    content?: ReactNode;
};

export const HELP_CONTENT = {
    searchForMainstems: {
        title: 'Search for Mainstems',
        items: [
            <>
                Use the <strong>Search Bar</strong> (left side of the screen) to
                find a Mainstem by its <strong>Name at Outlet</strong> or{' '}
                <strong>Uniform Resource Identifier (URI)</strong>.
            </>,
            <>
                Search results will appear in the search bar and be{' '}
                <strong>highlighted in yellow</strong> on the map.
            </>,
            <>
                Hover over a result to see the Mainstem&apos;s location in{' '}
                <strong>pink</strong>.
            </>,
            <>
                <strong>Click a Mainstem</strong> to view its related datasets.
            </>,
        ],
    },

    findDatasets: {
        title: 'Find Datasets',
        items: [
            <>
                After selecting a Mainstem from the <strong>Search Bar</strong>{' '}
                or the map, use the menu to narrow your search based on
                Variables Measured, Site Types, and Distribution Names.
            </>,
            <>
                The <strong>datasets request menu</strong> provides early
                insight into how many datasets are available and prevents
                fetching irrelevant results.
            </>,
        ],
    },

    exploreDatasets: {
        title: 'Explore Datasets',
        items: [
            <>
                After selecting a Mainstem, explore datasets within the side
                panel and use the Filter menu to refine your search.
            </>,
            <>
                Use the <strong>table</strong> to rapidly explore the contents
                of each dataset.
            </>,
        ],
    },

    searchVisually: {
        title: 'Search Visually',
        items: [
            <>
                Select a <strong>Hydrologic Region</strong> or{' '}
                <strong>zoom in</strong> to reveal Mainstems.
            </>,
            <>
                Hover over a Mainstem to display its{' '}
                <strong>Name at Outlet</strong>.
            </>,
            <>
                <strong>Click a Mainstem</strong> to open the datasets request
                menu.
            </>,
        ],
    },

    downloadData: {
        title: 'Download Data',
        items: [
            <>
                Once you&apos;ve found and filtered datasets, click{' '}
                <strong>Download CSV</strong> in the filter menu of the{' '}
                <strong>Search Bar</strong> to export results.
            </>,
        ],
    },

    getStarted: {
        title: 'Get Started',
        content: (
            <>
                Use the <strong>Search Bar</strong> or select a{' '}
                <strong>Hydrologic Region</strong> to begin exploring!
            </>
        ),
    },

    questions: {
        title: 'Questions',
        content: (
            <>
                Questions or issues with the Explorer? Let us know by opening a{' '}
                <a
                    href="https://github.com/internetofwater/explorer.geoconnex.us/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub issue
                </a>
                .
            </>
        ),
    },
} satisfies Record<string, THelpSection>;

export const INTRO_CONTENT = {
    getStarted: {
        title: HELP_CONTENT['getStarted']['title'],
        items: [
            <>{HELP_CONTENT['getStarted']['content']}</>,
            <>
                Zoom in to reveal <strong>Mainstems</strong>. Click on a
                mainstem to find datasets associated with it.
            </>,
        ],
    },
    needHelp: {
        title: 'Need Help?',
        content: (
            <>
                Click on the{' '}
                <span className="inline-block w-6 h-auto -mb-1.5">
                    <HelpIcon />
                </span>{' '}
                icon to find more information.
            </>
        ),
    },
    questions: HELP_CONTENT['questions'],
} satisfies Record<string, THelpSection>;
