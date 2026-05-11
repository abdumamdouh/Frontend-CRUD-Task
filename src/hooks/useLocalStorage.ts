import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, initialValue: string) {
	const [value, setValue] = useState(() => {
		const saved = localStorage.getItem(key);
		return saved ?? initialValue;
	});

	useEffect(() => {
		localStorage.setItem(key, value);
	}, [key, value]);

	return [value, setValue];
}
