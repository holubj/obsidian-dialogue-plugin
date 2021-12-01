import { CLASSES } from '../constants/classes';
import { DialogueSettings } from '../dialogue';
import { DialogueTitleMode } from '../constants/dialogueTitleMode';

export abstract class SIDES {
    static readonly LEFT = 'left';
    static readonly RIGHT = 'right';
}

export type MessageSide = typeof SIDES.LEFT | typeof SIDES.RIGHT;

export class Message {

    content: string;

    side: MessageSide;

    title: string;

    dialogueSettings: DialogueSettings;

	constructor(content: string, side: MessageSide, dialogueSettings: DialogueSettings) {
        this.content = content;
        this.side = side;
        this.dialogueSettings = dialogueSettings;

        this.title = this.side == SIDES.LEFT ? this.dialogueSettings.leftTitle : this.dialogueSettings.rightTitle;

        this.renderMessage();
	}

    renderMessage() {
        const messageEl = this.createMessageEl();

        if ( this.titleShouldRender() ) {
            messageEl.createDiv({cls: CLASSES.MESSAGE_TITLE, text: this.title});
        }

        messageEl.createDiv({cls: CLASSES.MESSAGE_CONTENT, text: this.content});
    }

    createMessageEl(): HTMLDivElement
    {
        const sideClass = this.side == SIDES.LEFT ? CLASSES.MESSAGE_WRAPPER_LEFT : CLASSES.MESSAGE_WRAPPER_RIGHT;
        const messageWrapperEl = this.dialogueSettings.parent.createDiv({
            cls: `${CLASSES.BLOCK_WRAPPER} ${sideClass}`
        });

        return messageWrapperEl.createDiv({
            cls: CLASSES.MESSAGE,
            attr: {
                style: `max-width: ${this.dialogueSettings.messageMaxWidth};`
            }
        });
    }

    titleShouldRender(): boolean {
        if ( this.title.length < 1 ) return false;

        switch ( this.dialogueSettings.titleMode ) {
            case DialogueTitleMode.Disabled: return false;
            case DialogueTitleMode.All: return true;
            case DialogueTitleMode.First: {
                if ( this.side == SIDES.LEFT && !this.dialogueSettings.leftTitleRenderedOnce ) {
                    this.dialogueSettings.leftTitleRenderedOnce = true;
                    return true;
                }
                else if ( this.side == SIDES.RIGHT && !this.dialogueSettings.rightTitleRenderedOnce ){
                    this.dialogueSettings.rightTitleRenderedOnce = true;
                    return true;
                }
                else {
                    return false;
                }
            }
            default: return false;
        }
    }
}
