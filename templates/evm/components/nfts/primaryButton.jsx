
export const PrimaryButton = ({ onClickCallback, href, text, newPage = true }) => {
	return (
		<div className={styles.button_container}>
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