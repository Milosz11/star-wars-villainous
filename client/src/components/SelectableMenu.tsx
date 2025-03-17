interface Props {
    items: string[];
    onSelectItem: (item: string) => void;
    selectedItem: string;
    disabled: boolean;
}

function SelectableMenu({ items, onSelectItem, selectedItem, disabled }: Props) {
    return (
        <>
            <ul className="list-group">
                {items.map((item) => (
                    <li
                        className={
                            "clickable list-group-item" + (item == selectedItem ? " active" : "")
                        }
                        key={item}
                        onClick={(_event) => {
                            if (!disabled) {
                                onSelectItem(item);
                            }
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default SelectableMenu;
