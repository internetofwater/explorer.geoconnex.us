import { useAppDispatch, useAppSelector } from '@/lib/state/hooks';
import { MODE, setMode } from '@/lib/state/main/slice';

export const useMode = () => {
    const mode = useAppSelector((s) => s.main.mode);

    const dispatch = useAppDispatch();

    const toggleMode = () => {
        dispatch(
            setMode(mode === MODE.Mainstems ? MODE.RiverRunner : MODE.Mainstems)
        );
    };

    const changeToMainstemsMode = () => {
        dispatch(setMode(MODE.Mainstems));
    };

    const changeToRiverRunnerMode = () => {
        dispatch(setMode(MODE.Mainstems));
    };

    return {
        toggleMode,
        changeToMainstemsMode,
        changeToRiverRunnerMode,
        inMainstemsMode: mode === MODE.Mainstems,
        inRiverRunnerMode: mode === MODE.RiverRunner,
        mode,
    };
};
