/*
 * some useful routines, mostly written by Copilot
 */


export const clipToRange = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

export const randomStream = (props: { periodMs: number; range: number }): Promise<number> => {
	const { periodMs: n, range: r } = props;
	return new Promise((resolve) => {
		setInterval(() => {
			const randomNumber = Math.random() * r;
			resolve(randomNumber);
		}, n);
	});
};

export const mapToRange = (
	value: number,
	min: number,
	max: number,
	newMin: number,
	newMax: number
): number => {
	return ((value - min) * (newMax - newMin)) / (max - min) + newMin;
};

export const clipTo0 = (value: number): number => {
	return Math.max(value, 0);
};


export const Wait = {
	forNull: async function (variable: any, interval = 100): Promise<void> {
		console.log('waiting for null...');
		await new Promise<void>((resolve) => {
			const timer = setInterval(() => {
				if (variable !== null) {
					console.log('Not Null!');
					clearInterval(timer);
					resolve();
				}
			}, interval);
		});
	},

	forTrue: async function (variable: boolean | null, interval = 100): Promise<void> {
		console.log('waiting for true...');
		await new Promise<void>((resolve) => {
			const timer = setInterval(() => {
				if (variable === true) {
					console.log('Truthy!');
					clearInterval(timer);
					resolve();
				}
			}, interval);
		});
	}
};

export function channelExtensionFor  (channel: number)  {
			return `.channel.${channel.toString()}`;
		};

export const Utils = {
	generateRandomKey(): string {
		return Math.random().toString(36);
	},

	formatDate(date: string): string {
		const dateObj = new Date(date);
		const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
		return dateObj.toLocaleDateString('en-US', options);
	},

	camelCaseNoWhiteSpace(str: string): string {
		let camelCaseStr = str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
				return word.toUpperCase();
			})
			.replace(/\s+/g, '');
		return camelCaseStr.replace(/\s+/g, '');
	},

	trimAndAddReadMoreLink(content: string, cutOffIndex: number = 200): string {
		const trimmedContent = content.substring(0, cutOffIndex);
		let lastTagIndex = trimmedContent.lastIndexOf('>' || '.');
		// skip possible  html tags at the start of the string
		lastTagIndex = lastTagIndex < 4 ? trimmedContent.length : lastTagIndex + 1;
		// todo: actually sanitize the html before returning
		const trimmedContentWithReadMore =
			trimmedContent.substring(0, lastTagIndex) +
			' <a class=" !no-underline hover:!text-secondary-400 text-xs" href="/">…Read More</a>';
		return trimmedContentWithReadMore;
	},

	repeatChar(char: string, i: number): string {
		let str = '';
		for (let j = 0; j < i; j++) {
			str += char;
		}
		return str;
	},

	scrambleString(str: string) {
		let a = str.split(''),
			n = a.length;

		for (let i = n - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join('');
	},

	rotateString(str: string) {
		if (str.length <= 1) {
			return str;
		}

		const rotatedStr = Array.from(str);
		for (let i = 0; i < str.length; i++) {
			const newIndex = (i + 1) % str.length;
			rotatedStr[newIndex] = str[i];
		}
		return rotatedStr.join('');
	}
};


