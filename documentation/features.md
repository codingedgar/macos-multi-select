
# Table of content
- [Select One Key](#select-one-key)
- [Toggle Key Selection](#toggle-key-selection)
- [Select Adjacent Keys](#select-adjacent-keys)
- [Deselect All](#deselect-all)
- [Select Next Key](#select-next-key)
- [Select Previous Key](#select-previous-key)
- [Select Next Adjacent Key](#select-next-adjacent-key)
- [Select Previous Adjacent Key](#select-previous-adjacent-key)
- [Changes in Index](#changes-in-index)


<a name="select-one-key"></a>
# Select One Key

## Properties
### Should be able to select one key in a non empty list

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `click` |


![demo](./images/select_one_key_scenario_1.gif)

### If another `Select One Key` if performed over a non-selected key, the previous is deselected

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `click` |


![demo](./images/select_one_key_scenario_2.gif)

### Should deselect all but the selected key
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `click` |
| Issue | https://github.com/codingedgar/macos-multi-select/issues/26 |

![demo](./images/select_one_key_scenario_3.gif)

<a name="toggle-key-selection"></a>
# Toggle Key Selection

## Properties
### Should be able to add and remove a selection one key in a non empty index

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⌘ + click` |


![demo](./images/toggle_key_selection_scenario_1.gif)

<a name="select-adjacent-keys"></a>
# Select Adjacent Keys

## Properties
### Should select from top to bottom in an empty list
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |


![demo](./images/select_adjacent_keys_scenario_1.gif)

### Should select from the last adjacent pivot
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |


![demo](./images/select_adjacent_keys_scenario_2.gif)

### Should perform a minus between the old and new `start key` adjacent key selections
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |

![demo](./images/select_adjacent_keys_scenario_3.gif)

### Should perform a minus between the old and new `end key` adjacent key selections

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |
| Issue | https://github.com/codingedgar/macos-multi-select/issues/17 |
![demo](./images/select_adjacent_keys_scenario_8.gif)

### Should find pivot in next selection even when pivot is in the initial state due to select adjacent on initial state

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |

![demo](./images/select_adjacent_keys_scenario_4.gif)

### Find pivot in bottom selection
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |

![demo](./images/select_adjacent_keys_scenario_5.gif)

### Find pivot in top selection
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⇧ + click` |

![demo](./images/select_adjacent_keys_scenario_6.gif)
![demo](./images/select_adjacent_keys_scenario_7.gif)

<a name="deselect-all"></a>
# Deselect All

## Properties
### Deselect All
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⌘ + ⌥ + A` (Command + Alt + A) |

![demo](./images/deselect_all_scenario_1.gif)

<a name="select-next-key"></a>

# Select Next Key
## Properties
### Should do nothing if no keys
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Down` |
![demo](./images/select_next_key_scenario_1.gif)

### Should start from the top

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Down` |

![demo](./images/select_next_key_scenario_2.gif)

### Should never select beyond last key

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Down` |

![demo](./images/select_next_key_scenario_3.gif)

### Should select next key from the last `Select Adjacent Key end key` not the `Select Adjacent Key start key`

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Down` |

![demo](./images/select_next_key_scenario_4.gif)
![demo](./images/select_next_key_scenario_5.gif)

### Should select next from the last selected even when the selection is bottom to top

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Down` |

![demo](./images/select_next_key_scenario_6.gif)

<a name="select-previous-key"></a>
# Select Previous Key
## Properties
### Should do nothing if the list is empty

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Up` |

![demo](./images/select_previous_key_scenario_1.gif)
### Should start from the bottom

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Up` |

![demo](./images/select_previous_key_scenario_2.gif)
### Should never select beyond first key

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Up` |

![demo](./images/select_previous_key_scenario_3.gif)
### Should select next key from the last `Select Adjacent Key end key` not the `Select Adjacent Key start key`

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Up` |

![demo](./images/select_previous_key_scenario_4.gif)
![demo](./images/select_previous_key_scenario_5.gif)
### Should select previous from the last selected even when the selection is bottom to top

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Arrow Up` |

![demo](./images/select_previous_key_scenario_6.gif)

<a name="select-next-adjacent-key"></a>
# Select Next Adjacent Key
## Properties
### In the initial state the user starts from the top
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
![demo](./images/select_next_adjacent_key_scenario_1.gif)

### When the last selected group is ascending then it selects the next key
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Shift ⇧ + Arrow Down` |

![demo](./images/select_next_adjacent_key_scenario_2.gif)
![demo](./images/select_next_adjacent_key_scenario_2_1.gif)

### When the selected group is ascending then it deselects the next key
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `Shift ⇧ + Arrow Down` |

![demo](./images/select_next_adjacent_key_scenario_3.gif)

### Ignores the adjacent pivot key (adjacent pivot is always selected)

|  |  |
| --- | ---|
| Implemented | ❌ |
| Has tests | ❌ |
| Hot Key | `Shift ⇧ + Arrow Down` |

![demo](./images/select_next_adjacent_key_scenario_4.gif)

### Adjacent group union
If the next element to select has an adjacent group of selected keys, it does an union of that group, and orders it as if it were selected with a `Select Next Adjacent Key` command (sequentially instead of the original order of selection).

|  |  |
| --- | ---|
| Implemented | ❌ |
| Has tests | ❌ |
| Hot Key | `Shift ⇧ + Arrow Down` |

![demo](./images/select_next_adjacent_key_scenario_5.gif)

<a name="select-previous-adjacent-key"></a>
# Select Previous Adjacent Key
## Properties
## Should start from bottom
## `Adjacent group` union
<a name="changes-in-index"></a>
# Changes in Index
## Properties
### Key added to the index in `Adjacent Range`
### Key added outside of `Adjacent Range`
### Non-selected Key removed from the index
