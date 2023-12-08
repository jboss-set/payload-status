import React from 'react';
import { Select, SelectOption, SelectList, MenuToggle, Panel, PanelMain,
          TextInputGroup, TextInputGroupMain, TextInputGroupUtilities, Button } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

const TypeAhead = ({id, options, isOpen, selected, onToggle, ...props}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');
  const [selectOptions, setSelectOptions] = React.useState(options);
  const [focusedItemIndex, setFocusedItemIndex] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  const textInputRef = React.useRef();
  React.useEffect(() => {
    let newSelectOptions = options;
    if (filterValue) {
      newSelectOptions = options.filter(menuItem => menuItem.toLowerCase().includes(filterValue.toLowerCase()));
      if (!newSelectOptions.length) {
        newSelectOptions = [`No results found for "${filterValue}"`];
      }
    }
    setSelectOptions(newSelectOptions);
    setActiveItem(null);
    setFocusedItemIndex(null);
  }, [filterValue, options]);

  const onSelect = (_event, value) => {
    console.log('selected', value);
    if (value && !value.toLowerCase().startsWith('no results')) {
      setInputValue(value);
      setFilterValue('');
    }
    setFocusedItemIndex(null);
    setActiveItem(null);
    props.onSelect(_event, value);
  };

  const onTextInputChange = (_event, value) => {
    setInputValue(value);
    setFilterValue(value);
  };

  const handleMenuArrowKeys = key => {
    let indexToFocus;
    if (isOpen) {
      if (key === 'ArrowUp') {
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }
      if (key === 'ArrowDown') {
        if (focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }
      setFocusedItemIndex(indexToFocus);
      const focusedItem = selectOptions.filter(option => !option.isDisabled)[indexToFocus];
      setActiveItem(`${id}-${focusedItem.value}`);
    }
  };

  const onInputKeyDown = event => {
    const enabledMenuItems = selectOptions.filter(option => !option.isDisabled);
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex ? enabledMenuItems[focusedItemIndex] : firstMenuItem;
    switch (event.key) {
      case 'Enter':
        if (isOpen && !focusedItem.toLowerCase().startsWith('no results')) {
          onSelect(event, focusedItem)
        }
        onToggle();
        setFocusedItemIndex(null);
        setActiveItem(null);
        break;
      case 'Tab':
      case 'Escape':
        onToggle();
        setActiveItem(null);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
      default:
        break;
    }
  };

  const menuToggle = toggleRef =>
    <MenuToggle ref={toggleRef} variant="typeahead" onClick={onToggle} isExpanded={isOpen} isFullWidth>
      <TextInputGroup isPlain>
        <TextInputGroupMain value={inputValue} onClick={onToggle} onChange={onTextInputChange} onKeyDown={onInputKeyDown}
                            id={`${id}-input`} autoComplete="off" innerRef={textInputRef}
                            placeholder="Choose…" {...(activeItem && {'aria-activedescendant': activeItem})}
                            role="combobox" isExpanded={isOpen} aria-controls={`${id}-listbox`} />

        <TextInputGroupUtilities>
          {!!inputValue && <Button variant="plain" onClick={() => {
              onSelect(null, '');
              setInputValue('');
              setFilterValue('');
              textInputRef?.current?.focus();
            }} aria-label="Clear input value">
              <TimesIcon aria-hidden />
            </Button>}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>;

  return (
    <Select isOpen={isOpen} selected={selected} onSelect={onSelect}
                onOpenChange={() => onToggle()} toggle={menuToggle}>
      <Panel isScrollable>
        <PanelMain maxHeight={props.maxHeight} tabIndex={0}>
          <SelectList id={`${id}-listbox`}>
            {selectOptions.map((option, index) =>
              <SelectOption key={index} isFocused={focusedItemIndex === index}
                            id={`${id}-${option}`} value={option} ref={null} children={option}/>
            )}
          </SelectList>
        </PanelMain>
      </Panel>
    </Select>

  );
};

export default TypeAhead;
