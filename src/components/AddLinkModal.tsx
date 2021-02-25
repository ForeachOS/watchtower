import * as React from 'react';
import Modal from 'react-modal';
import { BaseLink } from './LinkGrid';
// import "./AddLinkModal.scss";
import { Item } from 'types';

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

function AddIconSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

interface Props {
  addItem: (items: Item[]) => any;
  items: Item[];
}

const AddLinkModal: React.FC<Props> = ({ addItem, items }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');

  const onCancel = () => {
    setName('');
    setUrl('');
    setSelectedItem(null);
    setOpen(false);
  };

  const onSubmit = () => {
    const newItems: Item[] = [];

    if (selectedItem) newItems.push(selectedItem);
    if (url && name) newItems.push({ url: url, label: name, icon: '' });
    addItem(newItems);
    onCancel();
  };

  return (
    <>
      <button className="grid__inner-particle particle--button" onClick={() => setOpen(true)}>
        <AddIconSVG width={20} style={{ marginRight: '1rem' }} /> Add Link
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={onCancel}
        className="AddLinkModal"
        overlayClassName="AddLinkModal__Overlay"
        contentLabel="Example Modal"
      >
        <h3 className="Modal__Title">Add shortcut</h3>

        {items.length !== 0 && (
          <div>
            <p className="Modal__SectionTitle">Foreach shortcuts</p>
            <div className="Modal__ToggleButtonContainer">
              {items.map((v) => (
                <BaseLink
                  className="Modal__ToggleButton"
                  item={v}
                  key={v.url}
                  onClick={() => setSelectedItem((i) => (i && i.url === v.url ? null : v))}
                >
                  <input
                    style={{ marginRight: '10px' }}
                    type="radio"
                    readOnly
                    checked={!!selectedItem && v.url === selectedItem.url}
                  />
                  {v.icon && <img className="grid__inner-icon" src={v.icon} alt="" />}
                  {!v.icon && <span className="grid__inner-icon--default">{v.label.slice(0, 1)}</span>}
                  {v.label}
                </BaseLink>
              ))}
            </div>
          </div>
        )}
        <div className="Modal__CustomShortcut">
          <p className="Modal__SectionTitle">Custom shortcut</p>
          <label className="Modal__Input">
            Shortcut name
            <input
              placeholder="Website"
              type="text"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </label>
          <label className="Modal__Input">
            URL
            <input
              type="url"
              value={url}
              placeholder="https://myownurl.com"
              onChange={(event) => setUrl(event.currentTarget.value)}
            />
          </label>
        </div>
        <div className="Modal__Actions">
          <button className="Modal__Action" onClick={onCancel}>
            Cancel
          </button>
          <button className="Modal__Action Modal__Action-primary" onClick={onSubmit}>
            Add
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AddLinkModal;
