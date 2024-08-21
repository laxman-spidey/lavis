import { DropdownOption } from 'material-react-table';

const parseFromValuesOrFunc = <T, U>(fn: ((arg: U) => T) | T | undefined, arg: U): T | undefined =>
	fn instanceof Function ? fn(arg) : fn;

export const getValueAndLabel = (option?: DropdownOption): { label: string; value: string } => {
	let label: string = '';
	let value: string = '';

	if (option) {
		if (typeof option !== 'object') {
			label = option;
			value = option;
		} else {
			label = (option.label ?? option.text ?? option.value) as string;
			value = (option.value ?? label) as string;
		}
	}

	return { label, value };
};

export default parseFromValuesOrFunc;
