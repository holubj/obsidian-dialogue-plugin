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

    dialogueSettings: DialogueSettings;

	constructor(content: string, side: MessageSide, dialogueSettings: DialogueSettings) {
        this.content = content;
        this.side = side;
        this.dialogueSettings = dialogueSettings;

        this.renderMessage();
	}

    renderMessage() {
        const messageEl = this.createMessageEl();

        if ( this.dialogueSettings.titleMode != DialogueTitleMode.Disabled ) {
            let renderName = true;

            if ( this.dialogueSettings.titleMode == DialogueTitleMode.First ) {
                if ( this.side == SIDES.LEFT && !this.dialogueSettings.leftTitleRenderedOnce ) {
                    this.dialogueSettings.leftTitleRenderedOnce = true;
                }
                else if ( this.side == SIDES.RIGHT && !this.dialogueSettings.rightTitleRenderedOnce ){
                    this.dialogueSettings.rightTitleRenderedOnce = true;
                }
                else {
                    renderName = false;
                }
            }

            if ( renderName ) {
                const name = this.side == SIDES.LEFT ? this.dialogueSettings.leftTitle : this.dialogueSettings.rightTitle;

                if ( name.length > 0 ) {
                    messageEl.createDiv({cls: CLASSES.MESSAGE_TITLE, text: name});
                }
            }
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
}
