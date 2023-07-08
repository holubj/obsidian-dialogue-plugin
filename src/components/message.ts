import { DialogueFooterMode } from 'src/types/dialogueFooterMode';
import { DialogueTitleMode } from '../types/dialogueTitleMode';
import { CLASSES } from '../constants/classes';
import { DialogueSettings, FooterContent, Participant } from '../dialogue';

export abstract class SIDES {
    static readonly LEFT = 'left';
    static readonly RIGHT = 'right';
    static readonly CENTER = 'center';
}

export type MessageSide = typeof SIDES.LEFT | typeof SIDES.RIGHT | typeof SIDES.CENTER;

export class Message {

    side: MessageSide;

    participant: Participant;

    footerContent: FooterContent

    element?: HTMLDivElement;

    dialogueSettings: DialogueSettings;

    constructor(side: MessageSide, dialogueSettings: DialogueSettings) {
        this.side = side;
        this.dialogueSettings = dialogueSettings;

        switch(this.side) {
            case SIDES.LEFT: {
                this.participant = this.dialogueSettings.leftParticipant;
                this.footerContent = this.dialogueSettings.leftFooter;
                break;
            }
            case SIDES.RIGHT: {
                this.participant = this.dialogueSettings.rightParticipant;
                this.footerContent = this.dialogueSettings.rightFooter;
                break;
            }
            case SIDES.CENTER: {
                this.participant = this.dialogueSettings.centerParticipant;
                this.footerContent = this.dialogueSettings.centerFooter;
                break;
            }
        }
        
    }

    renderMessage() {
        this.element = this.createMessageEl();
        return this.element;
    }

    renderContent(content?: string) {
        return this.element.createDiv({ cls: CLASSES.MESSAGE_CONTENT, text: content });
    }

    renderTitle(title?: string) {
        return this.element.createDiv({ cls: CLASSES.MESSAGE_TITLE, text: title });
    }

    renderFooter(content?: string): HTMLDivElement {
        return this.element.createDiv({ cls: CLASSES.MESSAGE_FOOTER, text: content});
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

    defaultFooterShouldRender(): boolean {
        if (this.footerContent.content.length < 1) return false;

        switch (this.dialogueSettings.footerMode) {
            case DialogueFooterMode.Disabled: return false;
            case DialogueFooterMode.All: return true;
            default: return false;
        }
    }
}
