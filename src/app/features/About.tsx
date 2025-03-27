import { setView } from '@/lib/state/main/slice';
import { useDispatch } from 'react-redux';
import CloseButton from '@/app/components/common/CloseButton';
import { Typography } from '../components/common/Typography';

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
                <Typography
                    variant="h1"
                    as="h2"
                    className="text-2xl font-bold mb-4"
                >
                    About Us
                </Typography>

                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Our Mission
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                    </Typography>
                    <a href="#" className="text-blue-500 hover:underline">
                        Learn more about our mission
                    </a>
                </section>

                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Our Values
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>
                    <a href="#" className="text-blue-500 hover:underline">
                        Explore our values
                    </a>
                </section>

                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Our History
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        Curabitur pretium tincidunt lacus. Nulla gravida orci a
                        odio. Nullam varius, turpis et commodo pharetra, est
                        eros bibendum elit, nec luctus magna felis sollicitudin
                        mauris. Integer in mauris eu nibh euismod gravida.
                    </Typography>
                    <a href="#" className="text-blue-500 hover:underline">
                        Read about our history
                    </a>
                </section>

                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Our Team
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        Duis ac tellus et risus vulputate vehicula. Donec
                        lobortis risus a elit. Etiam tempor. Ut ullamcorper,
                        ligula eu tempor congue, eros est euismod turpis, id
                        tincidunt sapien risus a quam. Maecenas fermentum
                        consequat mi. Donec fermentum.
                    </Typography>
                    <a href="#" className="text-blue-500 hover:underline">
                        Meet our team
                    </a>
                </section>

                <section className="mb-8">
                    <Typography variant="h2" as="h3" className="mb-2">
                        Contact Us
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        Pellentesque malesuada nulla a mi. Duis sapien sem,
                        aliquet nec, commodo eget, consequat quis, neque.
                        Aliquam faucibus, elit ut dictum aliquet, felis nisl
                        adipiscing sapien, sed malesuada diam lacus eget erat.
                        Cras mollis scelerisque nunc. Nullam arcu. Aliquam
                        consequat.
                    </Typography>
                    <a href="#" className="text-blue-500 hover:underline">
                        Get in touch
                    </a>
                </section>
            </div>
        </div>
    );
};
