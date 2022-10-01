import { useState, useEffect } from "react";
import alchemy from "../utils/alchemy";
import { ethers } from "ethers";
import styles from "../../styles/ContractFunction.module.css";
import { PrimaryButton } from "./primaryButton";

export const ContractViewFunction = ({ address, name, inputs, abi }) => {
	const [output, setOutput] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const callNoInputContractFunction = () => {
		setLoading(true);
		alchemy.config.getProvider().then((provider) => {
			setLoading(true);
			const contract = new ethers.Contract(address, abi, provider);
			contract[name]()
				.then((output) => {
					setLoading(false);
					setOutput(output.toString());
				})
				.catch((e) => {
					console.log("NETWORK ERROR: CHANGE ALCHEMY NETWORK");
				});
		});
	};

	useEffect(() => {
		if (!inputs) {
			callNoInputContractFunction();
		}
	}, []);

	const callContractFunction = (functionName, params) => {
		alchemy.config
			.getProvider()
			.then((provider) => {
				console.log("calling contract function");
				const contract = new ethers.Contract(address, abi, provider);
				console.log(...params);
				contract[functionName](...params)
					.then((output) => {
						console.log(output.toString());
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
	if (loading)
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
				<p>Loading...</p>
			</>
		);

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

				{output && <p className={styles.output_container}>{output}</p>}

				{!inputs && (
					<PrimaryButton
						text={"Refresh"}
						onClickCallback={callNoInputContractFunction}
					></PrimaryButton>
				)}
			</div>
		</>
	);
};

export const ContractWriteFunction = ({ contract, name, inputs }) => {
	const [output, setOutput] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const callContractFunction = (functionName, params) => {
		contract[functionName](...params)
			.then((tx) => {
				setOutput("Waiting for transaction to be confirmed...");
				tx.wait().then((tx) => {
					console.log(tx);
					setOutput(JSON.stringify(tx));
					// if (typeof tx == "object") {
					// 	output = output.toString();
					// }
					// setOutput(output);
				});
			})
			.catch((e) => {
				console.log(e);
				setOutput(
					"Something went wrong, check your inputs and try again."
				);
			});
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

				{output && <p className={styles.output_container}>{output}</p>}
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
