# Select One Key

## Scenarios
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

### Should do nothing if selecting an already selected key
|  |  |
| --- | ---|
| Implemented | ❌ |
| Has tests | ❌ |
| Hot Key | `click` |
| Issue | https://github.com/codingedgar/macos-multi-select/issues/26 |

![demo](./images/select_one_key_scenario_3.gif)

# Toggle Key Selection

## Scenarios
### Should be able to add and remove a selection one key in a non empty index

|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⌘ + click` |


![demo](./images/toggle_key_selection_scenario_1.gif)

# Select Adjacent Keys

## Scenarios
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
| Implemented | ❌ |
| Has tests | ❌ |
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


# Deselect all

## Scenarios
### Deselect All
|  |  |
| --- | ---|
| Implemented | ✅ |
| Has tests | ✅ |
| Hot Key | `⌘ + ⌥ + A` (Command + Alt + A) |

![demo](./images/deselect_all_scenario_1.gif)

# Select Next
# Scenarios
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

# Select Previous Key
## Scenarios
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

# Select Next Adjacent Key
### Scenarios
## Should start from top
## `Adjacent range` union
# Select Previous Adjacent Key
### Scenarios
## Should start from bottom
## `Adjacent range` union

# Changes in Index
## Scenarios
### Key added to the index in `Adjacent Range`
### Key added outside of `Adjacent Range`
### Non-selected Key removed from the index
