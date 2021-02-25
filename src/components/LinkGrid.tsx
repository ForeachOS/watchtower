import * as React from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import { Item } from 'types';
import AddLinkModal from './AddLinkModal';

interface LinkProps {
  item: Item;
  onClick?: () => any;
  className?: string;
}

export const BaseLink: React.FC<LinkProps> = ({ item, children, onClick, className }) => (
  <div className={`grid__inner-particle ${className}`} onClick={onClick}>
    {children}
  </div>
);

const Link = SortableElement(BaseLink);

const DragHandle = SortableHandle(() => (
  <img className="grid__inner-icon--drag" src="/icons/DragIndicator.png" alt="" />
));

interface LinkGridProps {
  items: Item[];
  onRemove: (item: Item) => any;
  onAdd: (items: Item[]) => any;
  missingDefaultItems: Item[];
}

const LinkGrid: React.FC<LinkGridProps> = ({ items, onRemove, onAdd, missingDefaultItems }) => {
  return (
    <div className="grid__inner">
      {items.map((item, index) => (
        <Link key={item.url} item={item} index={index}>
          <DragHandle />
          <a
            style={{ flex: 1, cursor: 'pointer', textDecoration: 'none', color: 'var(--primary-color-dark)' }}
            href={item.url}
          >
            {item.icon && <img className="grid__inner-icon" src={item.icon} alt="" />}
            {!item.icon && <span className="grid__inner-icon--default">{item.label.slice(0, 1)}</span>}
            <span>{item.label}</span>
          </a>
          <div onClick={() => onRemove(item)} className="grid__inner-icon--trash">
            <img src="/icons/Trashbin.png" alt="" />
          </div>
        </Link>
      ))}
      <AddLinkModal addItem={onAdd} items={missingDefaultItems} />
    </div>
  );
};

export default SortableContainer(LinkGrid);
