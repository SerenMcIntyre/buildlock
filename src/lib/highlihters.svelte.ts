import { createHighlighter } from 'shiki';

const highlighter = $state(
	await createHighlighter({
		themes: ['nord'],
		langs: ['bash']
	})
);

export const highlight = (code: string) => {
	return highlighter.codeToHtml(code, {
		lang: 'bash',
		theme: 'nord'
	});
};
