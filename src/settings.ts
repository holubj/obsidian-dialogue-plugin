import { App, Setting, PluginSettingTab } from 'obsidian';
import DialoguePlugin from './main';
import { DialogueTitleMode } from './types/dialogueTitleMode';
import { DialogueFooterMode } from './types/dialogueFooterMode';

export interface DialoguePluginSettings {
	defaultLeftTitle: string;
	defaultRightTitle: string;
	defaultCenterTitle: string;
	defaultLeftFooter: string;
	defaultRightFooter: string;
	defaultCenterFooter: string;
	defaultClean: boolean;
	defaultRenderMarkdownTitle: boolean;
	defaultRenderMarkdownContent: boolean;
	defaultRenderMarkdownFooter: boolean;
	defaultRenderMarkdownComment: boolean;
	defaultTitleMode: DialogueTitleMode;
	defaultFooterMode: DialogueFooterMode;
	defaultMessageMaxWidth: string;
	defaultCommentMaxWidth: string;
}

export const DEFAULT_SETTINGS: DialoguePluginSettings = {
	defaultLeftTitle: '',
	defaultRightTitle: '',
	defaultCenterTitle: '',
	defaultLeftFooter: '',
	defaultRightFooter: '',
	defaultCenterFooter: '',
	defaultClean: true,
	defaultRenderMarkdownTitle: true,
	defaultRenderMarkdownContent: true,
	defaultRenderMarkdownFooter: true,
	defaultRenderMarkdownComment: true,
	defaultTitleMode: DialogueTitleMode.First,
	defaultFooterMode: DialogueFooterMode.All,
	defaultMessageMaxWidth: '60%',
	defaultCommentMaxWidth: '60%',
}

export class DialogueSettingTab extends PluginSettingTab {

	plugin: DialoguePlugin;

	constructor(app: App, plugin: DialoguePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Dialogue Settings' });

		const coffeeEl = containerEl.createEl('div', {
			attr: {
				style: "text-align: center; margin-bottom: 10px;"
			}
		});
		const coffeeLinkEl = coffeeEl.createEl('a', { href: "https://www.buymeacoffee.com/holubj" });
		coffeeLinkEl.createEl('img', {
			attr: {
				src: "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png",
				alt: "Buy Me A Coffee",
				style: "height: 60px; width: 217px;"
			}
		});

		new Setting(containerEl)
			.setName('Default left title')
			.setDesc('Default value for left title in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default left title')
					.setValue(this.plugin.settings.defaultLeftTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultLeftTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default right title')
			.setDesc('Default value for right title in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default right title')
					.setValue(this.plugin.settings.defaultRightTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultRightTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default center title')
			.setDesc('Default value for center title in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default center title')
					.setValue(this.plugin.settings.defaultCenterTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultCenterTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default title mode')
			.setDesc('Default title mode in all dialogues.')
			.addDropdown(cb => {
				Object.values(DialogueTitleMode).forEach(titleMode => {
					const mode = titleMode.toString();
					cb.addOption(mode, mode.charAt(0).toUpperCase() + mode.slice(1));
				});

				cb.setValue(this.plugin.settings.defaultTitleMode)
					.onChange(async (value) => {
						this.plugin.settings.defaultTitleMode = value as DialogueTitleMode;
						await this.plugin.saveSettings();
					});
			});
	
		new Setting(containerEl)
			.setName('Default left footer')
			.setDesc('Default value for left footer in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default left footer')
					.setValue(this.plugin.settings.defaultLeftFooter)
					.onChange(async (value) => {
						this.plugin.settings.defaultLeftFooter = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default right footer')
			.setDesc('Default value for right footer in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default right footer')
					.setValue(this.plugin.settings.defaultRightFooter)
					.onChange(async (value) => {
						this.plugin.settings.defaultRightFooter = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default center footer')
			.setDesc('Default value for center footer in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default center footer')
					.setValue(this.plugin.settings.defaultCenterFooter)
					.onChange(async (value) => {
						this.plugin.settings.defaultCenterFooter = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default footer mode')
			.setDesc('Default footer mode in all dialogues.')
			.addDropdown(cb => {
				Object.values(DialogueFooterMode).forEach(footerMode => {
					const mode = footerMode.toString();
					cb.addOption(mode, mode.charAt(0).toUpperCase() + mode.slice(1));
				});

				cb.setValue(this.plugin.settings.defaultFooterMode)
					.onChange(async (value) => {
						this.plugin.settings.defaultFooterMode = value as DialogueFooterMode;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Default max message width')
			.setDesc('Default max message width in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default max message width')
					.setValue(this.plugin.settings.defaultMessageMaxWidth)
					.onChange(async (value) => {
						this.plugin.settings.defaultMessageMaxWidth = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
			.setName('Default max comment width')
			.setDesc('Default max comment width in all dialogues.')
			.addText(text =>
				text.setPlaceholder('Enter default max comment width')
					.setValue(this.plugin.settings.defaultCommentMaxWidth)
					.onChange(async (value) => {
						this.plugin.settings.defaultCommentMaxWidth = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
		.setName('Default clean')
		.setDesc('Default value for hiding unparsable text.')
		.addToggle(toggle =>
			toggle.setValue(this.plugin.settings.defaultClean)
					.onChange(async (value) => {
						this.plugin.settings.defaultClean = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
		.setName('Default render markdown title')
		.setDesc('Default value for rendering markdown in title.')
		.addToggle(toggle =>
			toggle.setValue(this.plugin.settings.defaultRenderMarkdownTitle)
					.onChange(async (value) => {
						this.plugin.settings.defaultRenderMarkdownTitle = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
		.setName('Default render markdown content')
		.setDesc('Default value for rendering markdown in content.')
		.addToggle(toggle =>
			toggle.setValue(this.plugin.settings.defaultRenderMarkdownContent)
					.onChange(async (value) => {
						this.plugin.settings.defaultRenderMarkdownContent = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
		.setName('Default render markdown footer')
		.setDesc('Default value for rendering markdown in footer.')
		.addToggle(toggle =>
			toggle.setValue(this.plugin.settings.defaultRenderMarkdownFooter)
					.onChange(async (value) => {
						this.plugin.settings.defaultRenderMarkdownFooter = value;
						await this.plugin.saveSettings();
					}));

		new Setting(containerEl)
		.setName('Default render markdown comment')
		.setDesc('Default value for rendering markdown in comment.')
		.addToggle(toggle =>
			toggle.setValue(this.plugin.settings.defaultRenderMarkdownComment)
					.onChange(async (value) => {
						this.plugin.settings.defaultRenderMarkdownComment = value;
						await this.plugin.saveSettings();
					}));
	}
}
