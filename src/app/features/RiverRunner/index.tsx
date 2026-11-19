import { Guide } from '@/app/features/RiverRunner/Guide';
import { Transition } from '@/app/features/RiverRunner/Transition';
import MiniMap from './MiniMap';

type Props = {
    accessToken: string;
};

const RiverRunner: React.FC<Props> = (props) => {
    const { accessToken } = props;

    return (
        <>
            <Guide />
            <Transition />
            <MiniMap accessToken={accessToken} />
        </>
    );
};

export default RiverRunner;
