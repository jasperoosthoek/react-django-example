import { getBaseUrl } from '../../utils/Utils';

export const Image = ({ src, isFrontend = false, ...restProps }) => <img
	src={src.search('://') === -1 && !isFrontend
		? `${getBaseUrl()}${src}`
		: src
	}
	{...restProps}
/>
