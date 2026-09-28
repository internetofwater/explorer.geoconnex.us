import OpenIcon from '@/app/assets/icons/Open';
import Button from '@/app/components/common/Button';
import { Typography } from '@/app/components/common/Typography';
import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { EOverlay, setOverlay } from '@/lib/state/main/slice';

const Mainstem: React.FC = () => {
    const selected = useAppSelector((state) => state.mainstem.selected);
    const overlay = useAppSelector((state) => state.main.overlay);

    const dispatch = useAppDispatch();

    if (!selected) {
        return null;
    }

    const handleClick = () => {
        if (overlay !== EOverlay.Mainstem) {
            dispatch(setOverlay(EOverlay.Mainstem));
        }
    };

    const name = selected.name_at_outlet;

    return (
        <div className="bg-primary min-w-16 p-2 shadow-md flex flex-col items-start gap-2 rounded">
            <Typography variant="h3">{name}</Typography>
            <Button
                title={`Open dataset retrieval menu for: ${name}`}
                onClick={handleClick}
                disabled={overlay === EOverlay.Mainstem}
                className="flex flex-row justify-between items-center gap-2 ml-auto"
            >
                Update <OpenIcon className="w-5 h-5" />
            </Button>
        </div>
    );
};

export default Mainstem;
