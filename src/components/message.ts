import { CLASSES } from '../constants/classes';
import { DialogueSettings, Participant } from '../dialogue';
import { DialogueTitleMode } from '../types/dialogueTitleMode';

export abstract class SIDES {
    static readonly LEFT = 'left';
    static readonly RIGHT = 'right';
    static readonly CENTER = 'center';
}

export type MessageSide = typeof SIDES.LEFT | typeof SIDES.RIGHT | typeof SIDES.CENTER;

export class Message {

    content: string;

    side: MessageSide;

    participant: Participant;

    dialogueSettings: DialogueSettings;

    constructor(content: string, side: MessageSide, dialogueSettings: DialogueSettings) {
        this.content = content;
        this.side = side;
        this.dialogueSettings = dialogueSettings;

        switch(this.side) {
            case SIDES.LEFT: 
                this.participant = this.dialogueSettings.leftParticipant;
                break;
            case SIDES.RIGHT: 
                this.participant = this.dialogueSettings.rightParticipant;
                break;
            case SIDES.CENTER: 
                this.participant = this.dialogueSettings.centerParticipant;
                break;
        }
        
        this.renderMessage();
    }

    renderMessage() {
        const messageEl = this.createMessageEl();

        if (this.titleShouldRender()) {
            messageEl.createDiv({ cls: CLASSES.MESSAGE_TITLE, text: this.participant.title });
        }

        messageEl.createDiv({ cls: CLASSES.MESSAGE_CONTENT, text: this.content });
    }

    createMessageEl(): HTMLDivElement {

        let sideClass = CLASSES.MESSAGE_WRAPPER_LEFT;

        switch (this.side) {
            case SIDES.LEFT: sideClass = CLASSES.MESSAGE_WRAPPER_LEFT; break;
            case SIDES.RIGHT: sideClass = CLASSES.MESSAGE_WRAPPER_RIGHT; break;
            case SIDES.CENTER: sideClass = CLASSES.MESSAGE_WRAPPER_CENTER; break;
        }

        const messageWrapperEl = this.dialogueSettings.parent.createDiv({
            cls: `${CLASSES.BLOCK_WRAPPER} ${sideClass}`
        });

        return messageWrapperEl.createDiv({
            cls: CLASSES.MESSAGE,
            attr: {
                style: `max-width: ${this.dialogueSettings.messageMaxWidth};`,
                'data-participant-name': this.participant.title,
                'data-participant-id': this.participant.enforcedId ?? this.dialogueSettings.participants.get(this.participant.title)
            }
        });
    }

    titleShouldRender(): boolean {
        if (this.participant.title.length < 1) return false;

        switch (this.dialogueSettings.titleMode) {
            case DialogueTitleMode.Disabled: return false;
            case DialogueTitleMode.All: return true;
            case DialogueTitleMode.First: {
                if (this.participant.renderedOnce) return false;

                this.participant.renderedOnce = true;
                return true;
            }
            default: return false;
        }
    }
}
