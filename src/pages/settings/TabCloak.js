import { Check } from '@mui/icons-material';
import BareClient from 'bare-client';
import { useRef, useState } from 'react';
import { Obfuscated } from '../../obfuscate.js';
import { BARE_API } from '../../root.js';
import { http_s_protocol, whitespace } from '../../SearchBuilder.js';
import { ThemeButton, ThemeInputBar } from '../../ThemeElements.js';

async function extract_data(url) {
	const bare = new BareClient(BARE_API);

	const response = await bare.fetch(url, {
		redirect: 'follow',
	});

	if (!response.ok) {
		throw new Error(`Response was not OK. Got ${response.status}`);
	}

	const parser = new DOMParser();

	const dom = parser.parseFromString(`${await response.text()}`, 'text/html');

	const base = document.createElement('base');
	base.href = url;

	dom.head.append(base);

	let icon;
	let title;

	{
		const selector = dom.querySelector('link[rel*="icon"]');

		if (selector !== null && selector.href !== '') {
			icon = selector.href;
		} else {
			icon = new URL('/favicon.ico', url).toString();
		}
	}

	{
		const selector = dom.querySelector('title');

		if (selector !== null && selector.textContent !== '') {
			title = selector.textContent;
		} else {
			const url = response.finalURL;
			title = `${url.host}${url.pathname}${url.search}${url.query}`;
		}
	}

	return { icon, title };
}

function resolve_url(input) {
	if (input.match(http_s_protocol)) {
		return input;
	} else if (input.includes('.') && !input.match(whitespace)) {
		return `http://${input}`;
	} else {
		throw new Error('Bad URL');
	}
}

/**
 *
 * @param {string} url
 * @returns {{title:string,icon:string,url:string}}
 */
async function cloak_url(url) {
	switch (url) {
		case 'about:blank':
			return {
				title: 'about:blank',
				icon: 'none',
			};
		default:
			return await extract_data(resolve_url(url));
	}
}

export default function TabCloak(props) {
	const input = useRef();
	const [error, set_error] = useState(undefined);

	return (
		<section>
			<div>
				<Obfuscated>
					Tab Cloaking allows you to disguise Holy Unblocker as any website such
					as your school's home page, new tab, etc.
				</Obfuscated>
			</div>
			<div>
				<span>
					<Obfuscated>URL</Obfuscated>:
				</span>
				<form
					onSubmit={async event => {
						event.preventDefault();

						try {
							const { value } = input.current;
							const { title, icon } = await cloak_url(value);

							props.layout.current.cloak.set({
								title,
								icon,
								value,
							});
						} catch (error) {
							console.error(error);
							set_error(error.toString());
						}
					}}
				>
					<ThemeInputBar>
						<input
							className="thin-pad-right"
							defaultValue={props.layout.current.cloak.get('url')}
							placeholder="https://example.org/"
							ref={input}
						/>
						<Check className="button right" />
					</ThemeInputBar>
				</form>
			</div>
			<div>
				<ThemeButton
					onClick={() => {
						props.layout.current.cloak.set({
							title: '',
							icon: '',
							url: '',
						});
					}}
				>
					<Obfuscated>Reset Cloak</Obfuscated>
				</ThemeButton>
			</div>
			<p style={{ color: 'var(--error)' }}>{error}</p>
		</section>
	);
}
