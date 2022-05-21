# Obsidian Dialogue Plugin

Create dialogues in Markdown.

![dialogue](https://raw.githubusercontent.com/holubj/obsidian-dialogue-plugin/master/images/dialogue.png)

## Parameters

Parameters can be set using commands inside the dialogue. All available parameters are listed in the table below.

### Available parameters

| Parameter          | Description                                                                   | Default Value |
| ------------------ | ----------------------------------------------------------------------------- | ------------- |
| `left:` or `l:`    | Name of the dialogue participant on the left side.                            | none          |
| `right:` or `r:`   | Name of the dialogue participant on the right side.                           | none          |
| `titleMode:`       | Defines if and when to render titles. See available modes in the table below. | `first`       |
| `messageMaxWidth:` | Defines the max message width in the dialogue.                                | `60%`         |
| `commentMaxWidth:` | Defines the max comment width in the dialogue.                                | `60%`         |

### Title Modes

| Mode       | Description                                    |
| ---------- | ---------------------------------------------- |
| `disabled` | Disable all titles.                            |
| `first`    | Render each title only on the first occurence. |
| `all`      | Always render title.                           |

## Usage

### Simple usage

The message in the dialogue must be prefixed with

-   either `<` (message on the left side)
-   or `>` (message on the right side).

The message must be exactly one paragraph.

#### Example code

````
```dialogue
left: Ingmar Bergman
right: Wong Kar-wai

< Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec tristique nunc, et pharetra sem.
< Nunc id auctor lectus, feugiat aliquet sem.

> Lorem ipsum dolor sit amet
> Ut nec efficitur mauris, a lacinia purus. Fusce nisi arcu, sollicitudin eget sodales sit amet, consectetur a lorem. Nam egestas tristique felis, sed suscipit nunc commodo nec.
```
````

#### Result

![simple](https://raw.githubusercontent.com/holubj/obsidian-dialogue-plugin/master/images/simple.png)

### Advanced parameters

All parameters listed in the table above can be used to customize the dialogue.

#### Example code

````
```dialogue
left: Ingmar Bergman
right: Wong Kar-wai
titleMode: all
messageMaxWidth: 40%

< Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec tristique nunc, et pharetra sem.
< Nunc id auctor lectus, feugiat aliquet sem.

> Lorem ipsum dolor sit amet
> Ut nec efficitur mauris, a lacinia purus. Fusce nisi arcu, sollicitudin eget sodales sit amet, consectetur a lorem. Nam egestas tristique felis, sed suscipit nunc commodo nec.
```
````

#### Result

![parameters](https://raw.githubusercontent.com/holubj/obsidian-dialogue-plugin/master/images/parameters.png)

### Change of parameters during a dialogue

Parameters can be modified during the dialogue (the change is applied to all following messages).

#### Example code

````
```dialogue
left: Ingmar Bergman
right: Wong Kar-wai

< Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec tristique nunc, et pharetra sem.
< Nunc id auctor lectus, feugiat aliquet sem.

> Lorem ipsum dolor sit amet
> Ut nec efficitur mauris, a lacinia purus. Fusce nisi arcu, sollicitudin eget sodales sit amet, consectetur a lorem. Nam egestas tristique felis, sed suscipit nunc commodo nec.

left: Sion Sono

< Nulla condimentum orci quis enim iaculis, ut congue turpis semper. Donec mattis elit vitae risus molestie vestibulum.
< In laoreet aliquet neque, eget tempus massa congue ut.
```
````

#### Result

![parameters2](https://raw.githubusercontent.com/holubj/obsidian-dialogue-plugin/master/images/parameters2.png)

### Dialogue with delimiter

Use the `delimiter` (or shorter `-`) command to add a delimiter into the dialogue.

#### Example code

````
```dialogue
left: Ingmar Bergman
right: Wong Kar-wai

< Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec tristique nunc, et pharetra sem.
< Nunc id auctor lectus, feugiat aliquet sem.

delimiter

> Lorem ipsum dolor sit amet
> Ut nec efficitur mauris, a lacinia purus. Fusce nisi arcu, sollicitudin eget sodales sit amet, consectetur a lorem. Nam egestas tristique felis, sed suscipit nunc commodo nec.
```
````

#### Result

![delimiter](https://raw.githubusercontent.com/holubj/obsidian-dialogue-plugin/master/images/delimiter.png)

### Dialogue with comments

Comments can be added into the dialogue with `#` prefix (see example below). The comment must be exactly one paragraph.
Max width of the comments can be modified with the `commentMaxWidth:` parameter.

#### Example code

````
```dialogue
left: Ingmar Bergman
right: Wong Kar-wai

< Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec tristique nunc, et pharetra sem.
< Nunc id auctor lectus, feugiat aliquet sem.

# Lorem ipsum dolor sit amet

> Lorem ipsum dolor sit amet

# Vivamus nunc orci, aliquet varius rutrum et, pulvinar vitae nunc. Pellentesque a consequat ipsum.

> Ut nec efficitur mauris, a lacinia purus. Fusce nisi arcu, sollicitudin eget sodales sit amet, consectetur a lorem. Nam egestas tristique felis, sed suscipit nunc commodo nec.
```
````

#### Result

![comments](https://raw.githubusercontent.com/holubj/obsidian-dialogue-plugin/master/images/comments.png)

## Custom styles for messages

Messages have special `data` attributes to allow custom styling.

Each message has:

-   `data-participant-id` attribute with a unique numeric id as a value to identify the same dialogue participant (in order of appearance, starting from number 1)
-   `data-participant-name` attribute with a name of the dialogue participant as a value

These attributes can be used in a **CSS snippet** to apply custom styles to messages based on the message author. See example below.

### Specifying custom id for a dialogue particiant

To specify a custom id for a participant in the dialogue (for example if you want to have the same color for the selected participant across multiple dialogues), you can do it by appending the id in the participant definition (for example `left-2: Name`, where `2` is your id).

### Styling example

This example sets selected background colors for the first three unique dialogue participants (in order of appearance) and also one specific color for a dialogue participant named `Sion Sono`.

```css
/* messages from first dialogue participant will have #f00 background color */
.dialogue-plugin-message[data-participant-id="1"] {
	background-color: #f00;
}

/* messages from second dialogue participant will have #0f0 background color */
.dialogue-plugin-message[data-participant-id="2"] {
	background-color: #0f0;
}

/* messages from third dialogue participant will have #00f background color */
.dialogue-plugin-message[data-participant-id="3"] {
	background-color: #00f;
}

/* messages from dialogue participant named 'Sion Sono' will have #f0f background color */
.dialogue-plugin-message[data-participant-name="Sion Sono"] {
	background-color: #f0f;
}
```

## Say Thanks 🙏

If you like this plugin and would like to support its development, you can buy me a coffee!

<a href="https://www.buymeacoffee.com/holubj" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
