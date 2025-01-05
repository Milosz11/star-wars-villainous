import { useState } from "react";

interface Props {
    items: string[];
    onSelectItem: (item: string) => void;
}

function SelectableMenu({ items, onSelectItem }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

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
