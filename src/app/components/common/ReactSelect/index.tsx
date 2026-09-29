import { CSSProperties, useMemo } from 'react';
import Select, {
    components,
    GroupBase,
    MenuListProps,
    MultiValueProps,
    OptionsOrGroups,
    Props as SelectProps,
} from 'react-select';
import { getSelectAllOption } from '@/app/components/common/ReactSelect/utils';

type OptionBase = {
    value: string | number | null;
    label: string;
};

type Props<T extends OptionBase> = SelectProps<T> & {
    customClassnames?: Record<string, string>;
    customStyles?: Record<string, CSSProperties>;
    limit?: number;
    isAllSelectable?: boolean;
};

export const SELECT_ALL_VALUE = '*';

export const DESELECT_ALL_VALUE = '%';

const MenuList = <T extends OptionBase>({
    children,
    ...props
}: MenuListProps<T, boolean, GroupBase<T>> & {
    selectProps: {
        limit?: number;
    };
}) => {
    return (
        <components.MenuList {...props}>
            {
                Array.isArray(children) && props.selectProps.limit
                    ? children.slice(0, props.selectProps.limit) /* Options */
                    : children /* NoOptionsLabel */
            }
            {Array.isArray(children) &&
                props.selectProps.limit &&
                children.length > props.selectProps.limit && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            color: '#1C76CA',
                            padding: '0.5rem 0',
                            fontWeight: '700',
                            borderTop: '1px solid #000',
                        }}
                    >
                        More options findable by searching.
                    </div>
                )}
        </components.MenuList>
    );
};

const MoreSelectedBadge = ({ items }: { items: string[] }) => {
    const style = {
        color: '#1C76CA',
        fontWeight: '700',
        borderRadius: '4px',
        padding: '0.25rem 0.5rem',
        order: 99,
    };

    const title = items.join(', ');
    const length = items.length;
    const label = `+ ${length} item${length !== 1 ? 's' : ''} selected`;

    return (
        <div style={style} title={title}>
            {label}
        </div>
    );
};

const MultiValue = <T extends OptionBase>({
    index,
    getValue,
    ...props
}: MultiValueProps<T, boolean, GroupBase<T>>) => {
    const maxToShow = 3;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue index={index} getValue={getValue} {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};

const ReactSelect = <T extends OptionBase>(props: Props<T>) => {
    const {
        options,
        id,
        placeholder,
        value,
        isSearchable,
        isClearable,
        isLoading,
        isDisabled,
        isMulti,
        onChange,
        customClassnames,
        customStyles = {},
        isAllSelectable,
        menuPortalTarget,
        menuPosition = 'fixed',
        menuPlacement,
    } = props;

    const _options = useMemo(
        () =>
            isAllSelectable && options
                ? [
                      getSelectAllOption(
                          Array.isArray(options) &&
                              Array.isArray(value) &&
                              options.length === value.length
                      ),
                      ...options,
                  ]
                : options,
        [value, options, isAllSelectable]
    ) as OptionsOrGroups<T, GroupBase<T>>;

    const MenuListWithLimit = (menuProps: MenuListProps<T, boolean>) => (
        <MenuList
            {...menuProps}
            selectProps={{
                ...menuProps.selectProps,
                limit: props.limit,
            }}
        />
    );

    // TODO: react-select appears to not like its own props, supply needed props individually
    return (
        <Select<T, boolean>
            id={id}
            value={value}
            components={{ MenuList: MenuListWithLimit, MultiValue }}
            hideSelectedOptions={false}
            placeholder={placeholder}
            options={_options}
            isSearchable={isSearchable}
            isClearable={isClearable}
            isLoading={isLoading}
            isDisabled={isDisabled}
            isMulti={isMulti}
            onChange={onChange}
            menuPortalTarget={menuPortalTarget}
            menuPosition={menuPosition}
            menuPlacement={menuPlacement}
            styles={{
                container: (baseStyles) => ({
                    ...baseStyles,
                }),
                control: (baseStyles) => ({
                    ...baseStyles,
                    ...customStyles['control'],
                    cursor: 'pointer',
                }),
                dropdownIndicator: (baseStyles) => ({
                    ...baseStyles,
                    color: 'var(--border-color)',
                    ...customStyles['dropdownIndicator'],
                    fontSize: '1rem',
                }),
                indicatorSeparator: (baseStyles) => ({
                    ...baseStyles,
                    ...customStyles['indicatorSeparator'],
                    fontSize: '1rem',
                }),
                indicatorsContainer: (baseStyles) => ({
                    ...baseStyles,
                    ...customStyles['indicatorsContainer'],
                    fontSize: '1rem',
                }),
                placeholder: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '1rem',
                }),
                singleValue: (baseStyles) => ({
                    ...baseStyles,
                    ...customStyles['singleValue'],
                    fontSize: '1rem',
                }),
                menu: (baseStyles) => ({
                    ...baseStyles,
                    ...customStyles['menu'],
                    color: 'var(--text-color)',
                }),
                menuPortal: (base) => ({
                    ...base,
                    color: 'var(--text-color)',
                    z: 1,
                }),
            }}
            classNames={{
                container: () => `${customClassnames?.container} w-full`,
                menu: () =>
                    `${customClassnames?.menu} z-[--z-select-menu] [&>div]:overflow-x-hidden`,
                control: () => `${customClassnames?.control}`,
                indicatorsContainer: () =>
                    `${customClassnames?.indicatorContainer}`,
                indicatorSeparator: () =>
                    `${customClassnames?.indicatorSeparator}`,
            }}
        />
    );
};

export default ReactSelect;
