import { CLASSES } from '../constants/classes';
import { DialogueSettings, Participant } from '../dialogue';
import { DialogueTitleMode } from '../types/dialogueTitleMode';

export abstract class SIDES {
    static readonly LEFT = 'left';
    static readonly RIGHT = 'right';
}

export type MessageSide = typeof SIDES.LEFT | typeof SIDES.RIGHT;

export class Message {

    content: string;

    side: MessageSide;

    participant: Participant;

    dialogueSettings: DialogueSettings;

    constructor(content: string, side: MessageSide, dialogueSettings: DialogueSettings) {
        this.content = content;
        this.side = side;
        this.dialogueSettings = dialogueSettings;

        this.participant = this.side == SIDES.LEFT ? this.dialogueSettings.leftParticipant : this.dialogueSettings.rightParticipant;

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
        const sideClass = this.side == SIDES.LEFT ? CLASSES.MESSAGE_WRAPPER_LEFT : CLASSES.MESSAGE_WRAPPER_RIGHT;
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
