import { useState } from "react";
import alchemy from "../../core/pages/utils/alchemy";
import { ethers } from "ethers";
import styles from "../../styles/ContractFunction.module.css";
import { PrimaryButton } from "./primaryButton";

export const ContractViewFunction = ({
	address,
	resultValue,
	name,
	inputs,
	abi,
}) => {
	const [output, setOutput] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const callContractFunction = (functionName, params) => {
		alchemy.config
			.getProvider()
			.then((provider) => {
				const contract = new ethers.Contract(address, abi, provider);
				console.log(...params);
				contract[functionName](...params)
					.then((output) => {
						if (typeof output == "object") {
							output = output.toString();
						}
						setOutput(output);
					})
					.catch((e) =>
						setOutput(
							"Something went wrong, check your inputs and try again."
						)
					);
			})
			.catch((e) => console.log(e));
	};

	return (
		<>
			<div
				onClick={() => {
					setIsOpen(!isOpen);
					console.log(isOpen);
				}}
				className={styles.accordion}
			>
				<h4>{name}</h4>
			</div>

			<div className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
				{inputs &&
					generateInputs(name, inputs, callContractFunction).map(
						(inputField) => {
							return inputField;
						}
					)}

				{resultValue && <p>{resultValue}</p>}
				<div className={styles.output_container}>
					{output && <p>{output}</p>}
				</div>
			</div>
		</>
	);
};

export const ContractWriteFunction = ({ contract, name, inputs }) => {
	const [output, setOutput] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const callContractFunction = (functionName, params) => {
		contract[functionName](...params)
			.then((output) => {
				if (typeof output == "object") {
					output = output.toString();
				}
				setOutput(output);
			})
			.catch((e) =>
				setOutput(
					"Something went wrong, check your inputs and try again."
				)
			);
	};

	return (
		<>
			<div
				onClick={() => {
					setIsOpen(!isOpen);
					console.log(isOpen);
				}}
				className={styles.accordion}
			>
				<h4>{name}</h4>
			</div>

			<div className={`${styles.panel} ${isOpen ? styles.open : ""}`}>
				{inputs &&
					generateInputs(name, inputs, callContractFunction).map(
						(inputField) => {
							return inputField;
						}
					)}
				{output && <p>{output}</p>}
			</div>
		</>
	);
};

const generateInputs = (name, inputs, callContractFunction) => {
	const components = [];
	const params = [];

	for (const i = 0; i < inputs.length; i++) {
		const [a, b] = useState("");

		params.push(a);
		let component = (
			<input
				className={styles.input}
				value={a}
				onChange={(e) => {
					b(e.target.value);
				}}
				placeholder={`${inputs[i].name} (${inputs[i].internalType})`}
			></input>
		);
		components.push(component);
	}
	components.push(
		<PrimaryButton
			text={"Send"}
			onClickCallback={() => callContractFunction(name, params)}
		/>
	);
	return components;
};
