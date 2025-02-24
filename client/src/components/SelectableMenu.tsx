import { useEffect, useState } from "react";

interface Props {
    items: string[];
    onSelectItem: (item: string | null) => void;
}

function SelectableMenu({ items, onSelectItem }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // If the items prop changes, reset the selection
    const [previousItems, setPreviousItems] = useState(items); // TODO will have to test this when
    // displaying menus of the same list where one changes the other
    if (items !== previousItems) {
        setPreviousItems(items);
        setSelectedIndex(-1);
        onSelectItem(null);
    }

    return (
        <>
            <ul className="list-group">
                {items.map((item, index) => (
                    <li
                        className={
                            "clickable list-group-item" + (index == selectedIndex ? " active" : "")
                        }
                        key={item}
                        onClick={(_event) => {
                            setSelectedIndex(index);
                            onSelectItem(item);
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
