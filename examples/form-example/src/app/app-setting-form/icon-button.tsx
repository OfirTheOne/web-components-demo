import { FC } from "sig";

interface IconButtonProps { icon: JSX.Element, label: string, onClick: JSX.MouseEventHandler<HTMLButtonElement> }

export const IconButton: FC<IconButtonProps> = ({ icon, label, onClick }) => {
    return (
        <div
            className="flex items-center justify-center w-6 h-6 text-sky-600 transition-colors duration-150 border-gray-300 rounded-full shadow-sm hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClick}
            aria-label={label}
        >
            {icon}
        </div>
    );
};

