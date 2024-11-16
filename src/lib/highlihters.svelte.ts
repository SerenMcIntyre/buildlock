import { createHighlighter, type HighlighterGeneric } from 'shiki';

type Highlighter = HighlighterGeneric<'bash', 'nord'>;

let highlighter = $state<Highlighter | null>(null);
createHighlighter({
	themes: ['nord'],
	langs: ['bash']
}).then((hl) => {
	highlighter = hl;
});

export const highlight = (code: string) => {
	return (
		highlighter?.codeToHtml(code, {
			lang: 'bash',
			theme: 'nord'
		}) ?? ''
	);
};
