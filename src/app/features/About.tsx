import { setView } from '@/lib/state/main/slice';
import { useDispatch } from 'react-redux';
import CloseButton from '@/app/components/common/CloseButton';
import { Typography } from '@/app/components/common/Typography';
import Email from '@/app/assets/icons/Email';
import X from '@/app/assets/logos/X';
import GitHub from '@/app/assets/logos/GitHub';
import LinkedIn from '@/app/assets/logos/LinkedIn';

export const About: React.FC = () => {
    const dispatch = useDispatch();

    const handleCloseClick = () => {
        dispatch(setView('map'));
    };

    return (
        <div className="min-h-svh max-h-svh w-full overflow-auto bg-primary p-0 lg:pt-2">
            <CloseButton
                onClick={handleCloseClick}
                className="block pt-3 ml-auto mr-2 mb-2 text-gray-900 hover:text-gray-700 text-md"
                closeIconClassName="w-8 h-8"
            />
            <div className="p-4 lg:p-8">
                {/* <Typography
                    variant="h1"
                    as="h2"
                    className="text-2xl font-bold mb-4"
                >
                    About Us
                </Typography> */}

                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Geoconnex
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        The Geoconnex project provides technical infrastructure
                        and guidance for creating an open,
                        community-contribution model for a knowledge graph
                        linking hydrologic features in the United States,
                        published in accordance with{' '}
                        <a href="https://www.w3.org/TR/sdw-bp/" target="_blank">
                            Spatial Data on the Web
                        </a>{' '}
                        best practices as an implementation of{' '}
                        <a
                            href="https://internetofwater.org/internet-of-water-principles"
                            target="_blank"
                        >
                            Internet of Water
                        </a>{' '}
                        principles.
                        <br />
                        <br />
                        This project is supported by{' '}
                        <strong>USGS Cooperative Agreement G25AS00104</strong>
                    </Typography>
                    <a
                        href="https://docs.geoconnex.us/about/intro"
                        target="_blank"
                        aria-label="Geoconnex about page"
                    >
                        Learn More
                        <span className="sr-only">Learn More - Geoconnex</span>
                    </a>
                </section>
                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Internet of Water
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        The Internet of Water is a multi-stakeholder project to
                        create an ecosystem of water data providers that publish
                        their data in a FAIR (Findable, Accessible,
                        Interoperable, and Reusable) manner. The Internet of
                        Water includes a suite of open source software
                        development and data curation activities to assist in
                        the publication and indexing of water data. These
                        activities are managed by the Center for Geospatial
                        Solutions at the Lincoln Institute of Land Policy
                    </Typography>
                    <a
                        href="https://internetofwater.org/"
                        target="_blank"
                        aria-label="Internet of Water site"
                    >
                        Learn More
                        <span className="sr-only">
                            Learn More - Internet of Water
                        </span>
                    </a>
                </section>
                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Center for Geospatial Solutions
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        Established in 2020, the Center for Geospatial Solutions
                        (CGS) works to ensure that organizations of all sizes
                        have access to data and advanced technologies to improve
                        decision-making for land and water conservation, climate
                        action, and other efforts to promote social equity. We
                        extract better insights from data through a combination
                        of geographic information systems (GIS), earth
                        observations, artificial intelligence, machine learning,
                        and advanced analytics. We deliver products and services
                        that support decision-making, track impacts, and tell
                        powerful stories.
                    </Typography>
                    <a
                        href="https://www.lincolninst.edu/centers-initiatives/center-geospatial-solutions/"
                        target="_blank"
                    >
                        Learn More
                        <span className="sr-only">
                            Learn More - Center for Geospatial Solutions
                        </span>
                    </a>
                </section>
                <div className="flex items-center gap-x-2">
                    <a
                        href="mailto:internetofwater@lincolninst.edu"
                        aria-label="Mail to link for internet of water contact email"
                    >
                        <Email />
                    </a>
                    <span className="text-gray-300 text-4xl">|</span>
                    <a
                        href="https://github.com/internetofwater/explorer.geoconnex.us"
                        target="_blank"
                        aria-label="GitHub link to repository for this website"
                        className="no-underline"
                    >
                        <div className="pt-3 flex flex-col items-center justify-center">
                            <GitHub />
                            <Typography
                                variant="small"
                                className="text-secondary no-underline"
                            >
                                Explorer
                            </Typography>
                        </div>
                    </a>{' '}
                    <span className="text-gray-300 text-4xl">|</span>
                    <a
                        href="https://github.com/internetofwater/geoconnex.us"
                        target="_blank"
                        aria-label="GitHub link to main Geoconnex repository"
                        className="no-underline"
                    >
                        <div className="pt-3 flex flex-col items-center justify-center">
                            <GitHub />
                            <Typography
                                variant="small"
                                className="text-secondary no-underline"
                            >
                                Geoconnex
                            </Typography>
                        </div>
                    </a>{' '}
                    <span className="text-gray-300 text-4xl">|</span>
                    <a
                        href="https://www.linkedin.com/company/internetofwater/"
                        target="_blank"
                        aria-label="LinkedIn account for Internet of Water"
                    >
                        <LinkedIn />
                    </a>
                    <span className="text-gray-300 text-4xl">|</span>
                    <a
                        href="https://twitter.com/internetofh2o"
                        target="_blank"
                        aria-label="X account for Internet of Water"
                    >
                        <X />
                    </a>
                    |
                </div>
            </div>
        </div>
    );
};
