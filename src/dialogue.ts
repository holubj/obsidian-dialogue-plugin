import { DialoguePluginSettings } from './settings';
import { DialogueTitleMode } from './types/dialogueTitleMode';
import { DialogueFooterMode } from './types/dialogueFooterMode';
import { CLASSES } from './constants/classes';
import { Message, SIDES } from './components/message';
import { Delimiter } from './components/delimiter';
import { Comment } from './components/comment';
import { Component, MarkdownPreviewView } from 'obsidian';

abstract class KEYWORDS {
    static readonly LEFT_PATTERN = /^l(?:eft)?(?:-(\d+))?:/i;
    static readonly RIGHT_PATTERN = /^r(?:ight)?(?:-(\d+))?:/i;
    static readonly CENTER_PATTERN = /^c(?:enter)?(?:-(\d+))?:/i;
    static readonly LEFT_FOOTER_PATTERN = /^(lf|leftFooter):/i;
    static readonly RIGHT_FOOTER_PATTERN = /^(rf|rightFooter):/i;
    static readonly CENTER_FOOTER_PATTERN = /^(cf|centerFooter):/i;
    static readonly TITLE_MODE = 'titleMode:';
    static readonly FOOTER_MODE = 'footerMode:';
    static readonly MESSAGE_MAX_WIDTH = 'messageMaxWidth:';
    static readonly COMMENT_MAX_WIDTH = 'commentMaxWidth:';
    static readonly CLEAN = 'clean:';
    static readonly RENDER_MARKDOWN_TITLE = 'renderMarkdownTitle:';
    static readonly RENDER_MARKDOWN_CONTENT = 'renderMarkdownContent:';
    static readonly RENDER_MARKDOWN_FOOTER = 'renderMarkdownFooter:';
    static readonly RENDER_MARKDOWN_COMMENT = 'renderMarkdownComment:';
    static readonly DELIMITER = /^-|delimiter/;
    static readonly COMMENT = '#';
    static readonly FOOTER = '::';
    static readonly MESSAGE_LEFT = '<';
    static readonly MESSAGE_RIGHT = '>';
    static readonly MESSAGE_CENTER = '=';
}

export interface Participant {
    title: string;
    renderedOnce: boolean;
    enforcedId: string;
}

export interface FooterContent {
    content: string;
}

export interface DialogueSettings {
    parent: HTMLElement;
    leftParticipant: Participant;
    rightParticipant: Participant;
    centerParticipant: Participant;
    leftFooter: FooterContent;
    rightFooter: FooterContent;
    centerFooter: FooterContent;
    titleMode: DialogueTitleMode;
    footerMode: DialogueFooterMode;
    clean: boolean;
    renderMarkdownTitle: boolean;
    renderMarkdownContent: boolean;
    renderMarkdownFooter: boolean;
    renderMarkdownComment: boolean;
    messageMaxWidth: string;
    commentMaxWidth: string;
    participants: Map<string, number>;
}

export class DialogueRenderer {

    component: Component;

    src: string;

    dialogueWrapperEl: HTMLElement;

    dialogueSettings: DialogueSettings;

    constructor(component: Component, src: string, parent: HTMLElement, settings: DialoguePluginSettings) {
        this.component = component;
        
        this.src = src;

        this.dialogueWrapperEl = parent.createDiv({ cls: CLASSES.DIALOGUE_WRAPPER });

        this.dialogueSettings = {
            parent: this.dialogueWrapperEl,
            leftParticipant: {
                title: settings.defaultLeftTitle,
                renderedOnce: false,
                enforcedId: null,
            },
            rightParticipant: {
                title: settings.defaultRightTitle,
                renderedOnce: false,
                enforcedId: null,
            },
            centerParticipant: {
                title: settings.defaultCenterTitle,
                renderedOnce: false,
                enforcedId: null,
            },
            leftFooter: {
                content: settings.defaultLeftFooter,
            },
            rightFooter: {
                content: settings.defaultRightFooter,
            },
            centerFooter: {
                content: settings.defaultCenterFooter,
            },
            clean: settings.defaultClean,
            renderMarkdownTitle: settings.defaultRenderMarkdownTitle,
            renderMarkdownContent: settings.defaultRenderMarkdownContent,
            renderMarkdownFooter: settings.defaultRenderMarkdownFooter,
            renderMarkdownComment: settings.defaultRenderMarkdownComment,
            titleMode: settings.defaultTitleMode,
            footerMode: settings.defaultFooterMode,
            messageMaxWidth: settings.defaultMessageMaxWidth,
            commentMaxWidth: settings.defaultCommentMaxWidth,
            participants: new Map<string, number>(),
        }

        this.renderDialogue();
    }

    registerParticipant(participant: string) {
        if (!this.dialogueSettings.participants.has(participant)) {
            this.dialogueSettings.participants.set(participant, this.dialogueSettings.participants.size + 1); // starting from number 1
        }
    }

    getEnforcedId(pattern: RegExp, line: string, group = 1): string {
        let enforcedId = null;
        const result = pattern.exec(line);
        if (result != null && result.length > 1) {
            enforcedId = result[group];
        }

        return enforcedId;
    }

    renderDialogue() {
        const lines = this.src
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        let prevMessage: Message | null = null;
            
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            let message: Message | null = null;

            let comment: Comment | null = null;

            let customFooter = false;

            let content: string = '';

            if (KEYWORDS.LEFT_PATTERN.test(line)) {
                this.dialogueSettings.leftParticipant.title = line.split(':').splice(1).join(':').trim();
                this.dialogueSettings.leftParticipant.renderedOnce = false; // reset this flag when a new title is set
                this.dialogueSettings.leftParticipant.enforcedId = this.getEnforcedId(KEYWORDS.LEFT_PATTERN, line);
            }
            else if (KEYWORDS.RIGHT_PATTERN.test(line)) {
                this.dialogueSettings.rightParticipant.title = line.split(':').splice(1).join(':').trim();
                this.dialogueSettings.rightParticipant.renderedOnce = false; // reset this flag when a new title is set
                this.dialogueSettings.rightParticipant.enforcedId = this.getEnforcedId(KEYWORDS.RIGHT_PATTERN, line);
            }
            else if (KEYWORDS.CENTER_PATTERN.test(line)) {
                this.dialogueSettings.centerParticipant.title = line.split(':').splice(1).join(':').trim();
                this.dialogueSettings.centerParticipant.renderedOnce = false; // reset this flag when a new title is set
                this.dialogueSettings.centerParticipant.enforcedId = this.getEnforcedId(KEYWORDS.CENTER_PATTERN, line);
            }
            else if (KEYWORDS.LEFT_FOOTER_PATTERN.test(line)) {
                this.dialogueSettings.leftFooter.content = line.split(':').splice(1).join(':').trim();
            }
            else if (KEYWORDS.RIGHT_FOOTER_PATTERN.test(line)) {
                this.dialogueSettings.rightFooter.content = line.split(':').splice(1).join(':').trim();
            }
            else if (KEYWORDS.CENTER_FOOTER_PATTERN.test(line)) {
                this.dialogueSettings.centerFooter.content = line.split(':').splice(1).join(':').trim();
            }
            else if (line.startsWith(KEYWORDS.TITLE_MODE)) {
                const modeName = line.substr(KEYWORDS.TITLE_MODE.length).trim().toLowerCase();
                if (Object.values(DialogueTitleMode).some(mode => mode === modeName)) {
                    this.dialogueSettings.titleMode = modeName as DialogueTitleMode;
                }
            }
            else if (line.startsWith(KEYWORDS.FOOTER_MODE)) {
                const modeName = line.substr(KEYWORDS.FOOTER_MODE.length).trim().toLowerCase();
                if (Object.values(DialogueFooterMode).some(mode => mode === modeName)) {
                    this.dialogueSettings.footerMode = modeName as DialogueFooterMode;
                }
            }
            else if (line.startsWith(KEYWORDS.CLEAN)) {
                this.dialogueSettings.clean = line.substr(KEYWORDS.CLEAN.length).trim().toLowerCase() === 'true';
            }
            else if (line.startsWith(KEYWORDS.RENDER_MARKDOWN_TITLE)) {
                this.dialogueSettings.renderMarkdownTitle = line.substr(KEYWORDS.RENDER_MARKDOWN_TITLE.length).trim().toLowerCase() === 'true';
            }
            else if (line.startsWith(KEYWORDS.RENDER_MARKDOWN_CONTENT)) {
                this.dialogueSettings.renderMarkdownContent = line.substr(KEYWORDS.RENDER_MARKDOWN_CONTENT.length).trim().toLowerCase() === 'true';
            }
            else if (line.startsWith(KEYWORDS.RENDER_MARKDOWN_FOOTER)) {
                this.dialogueSettings.renderMarkdownFooter = line.substr(KEYWORDS.RENDER_MARKDOWN_FOOTER.length).trim().toLowerCase() === 'true';
            }
            else if (line.startsWith(KEYWORDS.RENDER_MARKDOWN_COMMENT)) {
                this.dialogueSettings.renderMarkdownComment = line.substr(KEYWORDS.RENDER_MARKDOWN_COMMENT.length).trim().toLowerCase() === 'true';
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_MAX_WIDTH)) {
                this.dialogueSettings.messageMaxWidth = line.substr(KEYWORDS.MESSAGE_MAX_WIDTH.length).trim();
            }
            else if (line.startsWith(KEYWORDS.COMMENT_MAX_WIDTH)) {
                this.dialogueSettings.commentMaxWidth = line.substr(KEYWORDS.COMMENT_MAX_WIDTH.length).trim();
            }
            else if (KEYWORDS.DELIMITER.test(line)) {
                new Delimiter(this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.COMMENT)) {
                content = line.substr(KEYWORDS.COMMENT.length);

                comment = new Comment(this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_LEFT)) {
                content = line.substr(KEYWORDS.MESSAGE_LEFT.length).trim();
                this.registerParticipant(this.dialogueSettings.leftParticipant.title);

                message = new Message(SIDES.LEFT, this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_RIGHT)) {
                content = line.substr(KEYWORDS.MESSAGE_RIGHT.length).trim();
                this.registerParticipant(this.dialogueSettings.rightParticipant.title);

                message = new Message(SIDES.RIGHT, this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.MESSAGE_CENTER)) {
                content = line.substr(KEYWORDS.MESSAGE_CENTER.length).trim();
                this.registerParticipant(this.dialogueSettings.centerParticipant.title);

                message = new Message(SIDES.CENTER, this.dialogueSettings);
            }
            else if (line.startsWith(KEYWORDS.FOOTER)) {
                customFooter = true;
                content = line.substr(KEYWORDS.FOOTER.length);
            } else if (!this.dialogueSettings.clean) {
                const unparsedEl = this.dialogueWrapperEl.createDiv({ cls: CLASSES.UNPARSED });
                this.renderMarkdown(line, unparsedEl, false)
            }

            // MESSAGE

            if (message != null) {
                message.renderMessage();

                if (message.titleShouldRender()) {
                    const titleEl = message.renderTitle(
                        this.dialogueSettings.renderMarkdownTitle ? undefined : message.participant.title
                        );

                        if (this.dialogueSettings.renderMarkdownTitle) {
                            this.renderMarkdown(message.participant.title, titleEl)
                        }
                }

                const contentEl = message.renderContent(
                    this.dialogueSettings.renderMarkdownContent ? undefined : content
                    );

                if (this.dialogueSettings.renderMarkdownContent) {
                    this.renderMarkdown(content, contentEl)
                }
            }

            // COMMENT

            if (comment != null) {
                const cmtEl = comment.renderComment(
                    this.dialogueSettings.renderMarkdownComment ? undefined : content
                    );

                if (this.dialogueSettings.renderMarkdownComment) {
                    this.renderMarkdown(content, cmtEl)
                }
            }

            // FOOTER

            if (prevMessage !== null) {
                this.renderMessageFooter(prevMessage, customFooter ? content : undefined);
            }

            // resets prev message
            prevMessage = message;
        }

        // Set footer for last message
        if (prevMessage !== null) {
            this.renderMessageFooter(prevMessage);
        }
    }

    renderMessageFooter(message: Message, content?: string ) {
        let footerContent = content;
        if (footerContent === undefined && this.dialogueSettings.footerMode === DialogueFooterMode.All && message.defaultFooterShouldRender()) {
            footerContent = message.footerContent.content;
        }

        if (footerContent) {
            const footerEl = message.renderFooter(this.dialogueSettings.renderMarkdownFooter ? undefined : footerContent);

            if (this.dialogueSettings.renderMarkdownFooter) {
                this.renderMarkdown(footerContent, footerEl)
            }
        }
    }

    renderMarkdown(content: string, el: HTMLElement, wrapper: boolean = true) {
        const renderEl = wrapper ? el.createDiv({ cls: CLASSES.RENDER }) : el;

        MarkdownPreviewView.renderMarkdown(content, renderEl, this.src, this.component)
    }

}
