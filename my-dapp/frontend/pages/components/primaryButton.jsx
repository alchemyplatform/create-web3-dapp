import styles from "../../styles/PrimaryButton.module.css";

export const PrimaryButton = ({
	onClickCallback,
	href,
	text,
	newPage = true,
}) => {
	return (
		<div
			onClick={typeof onClickCallback === "function" && (() => {
				onClickCallback();
			})}
		>
			<a
				className={styles.button}
				href={href}
				target={newPage ?? "_blank"}
			>
				{text}
			</a>
		</div>
	);
};
