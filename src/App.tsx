import React from 'react';
import { SortEndHandler } from 'react-sortable-hoc';
import { format } from 'date-fns';

import LinkGrid from './components/LinkGrid';
import GoogleSearch from './components/GoogleSearch';
import Toggle from './components/Toggle';
// import Login from "./Login";

// import "./App.scss";
import { Item } from './types';
import { useLocalStorage, setCSSTheme, useInterval } from './utils';
import { getDefaultItems } from './api';

// a little function to help us with reordering the result
const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  if (startIndex === endIndex) return list;
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const App: React.FC = () => {
  const [defaultItems, setDefaultItems] = useLocalStorage<Item[]>('defaultItems', []);
  const [items, setItems] = useLocalStorage<Item[]>('links', []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const [time, setTime] = React.useState(format(Date.now(), 'dd/MM/yy HH:mm'));
  const isMounted = React.useRef(false);

  const [settingsActive, setSettingsActive] = React.useState(false);

  const missingDefaultItems = React.useMemo(() => {
    return defaultItems.filter((i) => items.findIndex((item) => item.url === i.url) === -1);
  }, [items, defaultItems]);

  useInterval(() => {
    setTime(format(Date.now(), 'dd/MM/yy HH:mm'));
  }, 1 * 1000);

  // React.useEffect(() => {
  // const token = window.localStorage.getItem("token");
  // getUser(token!).then(res => res && setItems(res.links));
  // }, []);

  React.useEffect(() => {
    getDefaultItems().then((r) => {
      const updatedItems = items.map((i) => {
        const defaultItem = defaultItems.find((di) => di.label === i.label);
        return defaultItem ?? i;
      });

      const newItems = r.filter((item) => defaultItems.findIndex((di) => di.label === item.label) === -1);
      if (newItems.length !== 0) {
        setItems([...updatedItems, ...newItems]);
      } else {
        setItems(updatedItems);
      }

      setDefaultItems(r);
    });
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (defaultItems.length !== 0 && items.length === 0) {
      setItems(defaultItems);
    }
  }, [defaultItems, items.length, setItems]);

  React.useEffect(() => {
    if (isMounted.current) {
      //updateLinks(items);
    }
  }, [items]);

  React.useEffect(() => {
    if (isMounted.current) {
      //updateTheme(theme);
    }
    // save theme & switch css vars
    setCSSTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    isMounted.current = true;
  }, []);

  const onDragEnd: SortEndHandler = (result) => {
    setItems(reorder(items, result.oldIndex, result.newIndex));
  };

  const onRemove = (item: Item) => {
    setItems(items.filter((i) => i.url !== item.url));
  };

  const onAdd = (newItems: Item[]) => {
    setItems(items.concat(newItems.filter((i) => items.findIndex((currentI) => currentI.url === i.url) === -1)));
  };

  const toggleTheme = () => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));

  return (
    <div className="App">
      <div className="page__header">
        <img src="/icons/foreach-icon.svg" alt="dit is het logo van foreach" className="page__logo"></img>
        <h1>Watchtower</h1>
        <img
          onClick={() => {
            window.localStorage.clear();
            window.location.reload();
          }}
          src="/icons/PowerButton.svg"
          alt=""
          className="page__logout"
        />
        <button className="Button" onClick={() => setSettingsActive((a) => !a)}>
          {settingsActive ? 'Home' : 'Import / Export'}
        </button>
        {/* <button onClick={() => {
          const links = localStorage.getItem('links');
          links && navigator.clipboard.writeText(links);
        }}>Export</button>
        <button onClick={() => {
          navigator.clipboard.readText().then((linksRaw) => {
            const links = JSON.parse(linksRaw);
            setItems(links);
          })
        }}>Import</button> */}
      </div>
      {/* <Login /> */}
      {settingsActive ? (
        <div className="page__wrapper">
          <div className="page__content">
            <div style={{ paddingBottom: '10px' }}>
              <span>Export - Copy this and paste it in the import page in the other browser.</span>
              <br />
              <input style={{ width: '100%', marginTop: '10px' }} readOnly value={JSON.stringify(items)} />
            </div>
            <span style={{ paddingBottom: '5px' }}>
              Import - Paste an export field from another browser here, warning this will override your links!
            </span>
            <input
              onChange={(e) => {
                const parsedOutput = JSON.parse(e.currentTarget.value);
                setItems(parsedOutput);
              }}
            ></input>
          </div>
        </div>
      ) : (
        <div className="page__wrapper">
          <div className="page__content">
            <div style={{ display: 'flex' }}>
              <h2 className="left" style={{ flex: 3 }}>
                {time}
              </h2>
              <Toggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            <GoogleSearch />
          </div>
          <div>
            <LinkGrid
              useDragHandle
              onRemove={onRemove}
              onSortEnd={onDragEnd}
              axis="xy"
              items={items}
              missingDefaultItems={missingDefaultItems}
              onAdd={onAdd}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
