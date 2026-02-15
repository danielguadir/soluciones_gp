import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TransferList = ({
  items,
  titleAvailable,
  titleSelected,
  disabledItems = [],
  height = "290px",
  onTransfer = () => {},
}) => {
  const [leftItems, setLeftItems] = useState([...items]);
  const [rightItems, setRightItems] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [rightSelected, setRightSelected] = useState([]);
  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverList, setDragOverList] = useState(null);

  useEffect(() => {
    console.log("rightItems: ", rightItems);
    if (rightItems.length !== 0) {
      onTransfer({ rightItems });
    }
  }, [rightItems]);

  // Inicializar items
  useEffect(
    () => {
      const initialLeft = items.filter(
        (item) => !disabledItems.includes(item.id)
      );
      const initialRight = items.filter((item) =>
        disabledItems.includes(item.id)
      );
      setLeftItems(initialLeft);
      setRightItems(initialRight);
    },
    [
      //items, disabledItems
    ]
  );

  // Funciones de filtrado
  const filteredLeftItems = leftItems.filter((item) =>
    item.label.toLowerCase().includes(leftFilter.toLowerCase())
  );

  const filteredRightItems = rightItems.filter((item) =>
    item.label.toLowerCase().includes(rightFilter.toLowerCase())
  );

  // Funciones de selección
  const handleLeftSelect = (item, event) => {
    if (event.ctrlKey || event.metaKey) {
      setLeftSelected((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setLeftSelected((prev) => (prev.includes(item) ? [] : [item]));
    }
  };

  const handleRightSelect = (item, event) => {
    if (event.ctrlKey || event.metaKey) {
      setRightSelected((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    } else {
      setRightSelected((prev) => (prev.includes(item) ? [] : [item]));
    }
  };

  // Funciones de transferencia
  const transferToRight = () => {
    setRightItems([...rightItems, ...leftSelected]);
    setLeftItems(leftItems.filter((item) => !leftSelected.includes(item)));
    setLeftSelected([]);
  };

  const transferToLeft = () => {
    setLeftItems([...leftItems, ...rightSelected]);
    setRightItems(rightItems.filter((item) => !rightSelected.includes(item)));
    setRightSelected([]);
  };

  const transferAllToRight = () => {
    setRightItems([...rightItems, ...leftItems]);
    setLeftItems([]);
    setLeftSelected([]);
  };

  const transferAllToLeft = () => {
    setLeftItems([...leftItems, ...rightItems]);
    setRightItems([]);
    setRightSelected([]);
  };

  // Funciones de drag and drop
  const handleDragStart = (item, listType) => {
    setDraggedItem({ ...item, from: listType });
  };

  const handleDragOver = (e, listType) => {
    e.preventDefault();
    setDragOverList(listType);
  };

  const handleDrop = (e, targetList) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.from === targetList) {
      setDragOverList(null);
      return;
    }

    if (targetList === "right") {
      setRightItems([...rightItems, draggedItem]);
      setLeftItems(leftItems.filter((item) => item.id !== draggedItem.id));
    } else {
      setLeftItems([...leftItems, draggedItem]);
      setRightItems(rightItems.filter((item) => item.id !== draggedItem.id));
    }

    setDraggedItem(null);
    setDragOverList(null);
  };

  return (
    <div
      className="transfer-list-container"
      style={{ "--cmp-transferList-height": `${height}` }}
    >
      {/* Lista izquierda (disponibles) */}
      <div
        className={`list-container ${
          dragOverList === "left" ? "drag-over" : ""
        }`}
        onDragOver={(e) => handleDragOver(e, "left")}
        onDrop={(e) => handleDrop(e, "left")}
      >
        <h3>
          {titleAvailable} ({leftItems.length})
        </h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={leftFilter}
          onChange={(e) => setLeftFilter(e.target.value)}
          className="search-input"
        />
        <ul className="item-list">
          {filteredLeftItems.map((item) => (
            <li
              key={item.id}
              onClick={(e) => handleLeftSelect(item, e)}
              onDoubleClick={transferToRight}
              className={`${leftSelected.includes(item) ? "selected" : ""} ${
                disabledItems.includes(item.id) ? "disabled" : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(item, "left")}
            >
              {item.label}
              {item.icon && <span className="item-icon">{item.icon}</span>}
            </li>
          ))}
          {filteredLeftItems.length === 0 && (
            <li className="empty-message">No hay items disponibles</li>
          )}
        </ul>
      </div>
      {/* Botones de transferencia */}
      <div className="buttons-container">
        <button
          onClick={transferToRight}
          disabled={leftSelected.length === 0}
          aria-label="Mover seleccionados a la derecha"
        >
          &gt;
        </button>
        <button
          onClick={transferAllToRight}
          disabled={leftItems.length === 0}
          aria-label="Mover todos a la derecha"
        >
          &raquo;
        </button>

        <button
          onClick={transferToLeft}
          disabled={rightSelected.length === 0}
          aria-label="Mover seleccionados a la izquierda"
        >
          &lt;
        </button>
        <button
          onClick={transferAllToLeft}
          disabled={rightItems.length === 0}
          aria-label="Mover todos a la izquierda"
        >
          &laquo;
        </button>
      </div>
      {/* Lista derecha (seleccionados) */}
      <div
        className={`list-container ${
          dragOverList === "right" ? "drag-over" : ""
        }`}
        onDragOver={(e) => handleDragOver(e, "right")}
        onDrop={(e) => handleDrop(e, "right")}
      >
        <h3>
          {titleSelected} ({rightItems.length})
        </h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={rightFilter}
          onChange={(e) => setRightFilter(e.target.value)}
          className="search-input"
        />
        <ul className="item-list">
          {filteredRightItems.map((item) => (
            <li
              key={item.id}
              onClick={(e) => handleRightSelect(item, e)}
              onDoubleClick={transferToLeft}
              className={`${rightSelected.includes(item) ? "selected" : ""} ${
                disabledItems.includes(item.id) ? "disabled" : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(item, "right")}
            >
              {item.label}
              {item.icon && <span className="item-icon">{item.icon}</span>}
            </li>
          ))}
          {filteredRightItems.length === 0 && (
            <li className="empty-message">No hay items seleccionados</li>
          )}
        </ul>
      </div>
    </div>
  );
};

TransferList.propTypes = {
  items: PropTypes.array.isRequired,
  titleAvailable: PropTypes.string,
  titleSelected: PropTypes.string,
  disabledItems: PropTypes.array,
};

export { TransferList };
