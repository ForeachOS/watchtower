import * as React from 'react';

const GoogleSearch: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value);

  const onSubmit = () => window.open(`https://google.com/search?q=${query}`, '_blank');

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  React.useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onSubmit={onSubmit}
        className="google__input"
        placeholder="Search google"
        type="text"
      />
      <img className="google-icon" src="/icons/google.png" alt="google" />
    </>
  );
};

export default GoogleSearch;
