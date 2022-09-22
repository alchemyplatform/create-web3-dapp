import { useState } from "react";
import { PrimaryButton } from "./primaryButton";
import { ethers } from "ethers";
import styles from "../../styles/SmartContractPlayground.module.css";

import {
	ContractViewFunction,
	ContractWriteFunction,
} from "./contractFunction";
import { useSigner } from "wagmi";

export const SmartContractPlayground = () => {
	const [contractAddress, setContractAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const [components, setComponents] = useState(null);
	const { data: signer, isError, isLoading } = useSigner();

	const fetchContractABI = () => {
		setLoading(true);
		try {
			fetch("/api/getContractAbi", {
				method: "POST",
				body: JSON.stringify({
					contractAddress: contractAddress,
					chain: "ETH_GOERLI",
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					setLoading(false);
					const filteredABI = filterList(
						data.result,
						contractAddress,
						signer
					);
					generateComponents(
						filteredABI,
						data.result,
						contractAddress,
						signer
					).then((components) => {
						setComponents(components);
					});
				});
		} catch (e) {
			setComponents();
		}
	};

	if (loading) return <p>Loading...</p>;

	return (
		<div className={styles.container}>
			<div className={styles.searchBox}>
				<input
					className={styles.contract_address_input}
					value={contractAddress}
					placeholder="0x000000000000000000000000000000000"
					onChange={(e) => {
						setContractAddress(e.target.value);
					}}
				></input>
				<PrimaryButton
					text={"fetch abi"}
					onClickCallback={fetchContractABI}
				></PrimaryButton>
			</div>

			{components && (
				<div className={styles.functions_container}>
					{[...components.readOnlyComponents]} <h2> Write</h2>{" "}
					{[...components.writeComponents]}
				</div>
			)}
		</div>
	);
};

const filterList = (smartContractABI) => {
	const ABI = JSON.parse(smartContractABI);
	const readFunctions = {
		withInput: [],
		withoutInput: [],
	};
	const writeFunctions = {
		withInput: [],
		withoutInput: [],
	};

	for (const abi of ABI) {
		if (abi.type == "function") {
			switch (abi.stateMutability) {
				case "view":
					if (abi.inputs.length) {
						const { name, inputs, outputs } = abi;
						console.log("pushing readfunction", name);
						readFunctions.withInput.push({ name, inputs, outputs });
					} else {
						const { name, inputs } = abi;
						console.log(name);
						readFunctions.withoutInput.push({ name, inputs });
					}
					break;
				case "pure":
					break;
				case "nonpayable":
					if (abi.inputs.length) {
						const { name, inputs, outputs } = abi;
						console.log("pushing", name);

						writeFunctions.withInput.push({
							name,
							inputs,
							outputs,
						});
					} else {
						const { name, inputs } = abi;

						writeFunctions.withoutInput.push({ name, inputs });
					}
					break;
				case "payable":
					break;
				default:
					break;
			}
		}
	}

	return { readFunctions, writeFunctions };
};

const generateComponents = async (functionsList, abi, address, signer) => {
	const readOnlyComponents = await generateReadOnlyComponent(
		functionsList.readFunctions,
		abi,
		address
	);
	const writeComponents = await generateWriteComponent(
		functionsList.writeFunctions,
		abi,
		address,
		signer
	);

	return { readOnlyComponents, writeComponents };
};
const generateWriteComponent = async (
	writeFunctionsABIList,
	abi,
	contractAddress,
	signer
) => {
	let components = [];
	console.log(writeFunctionsABIList.withInput);
	const contract = new ethers.Contract(contractAddress, abi, signer);
	for (const tempAbi of writeFunctionsABIList.withoutInput) {
		try {
			const component = (
				<ContractWriteFunction
					contract={contract}
					name={tempAbi.name}
				/>
			);
			components.push(component);
		} catch (e) {
			console.log(e);
		}
	}

	for (const tempAbi of writeFunctionsABIList.withInput) {
		const component = (
			<ContractWriteFunction
				name={tempAbi.name}
				inputs={tempAbi.inputs}
				contract={contract}
			/>
		);
		components.push(component);
	}
	console.log(components);
	return components;
};

const generateReadOnlyComponent = async (
	viewFunctionsABIList,
	abi,
	address
) => {
	let components = [];

	for (const tempAbi of viewFunctionsABIList.withoutInput) {
		try {
			const component = (
				<ContractViewFunction
					address={address}
					name={tempAbi.name}
					abi={abi}
				/>
			);
			components.push(component);
		} catch (e) {
			console.log(e);
		}
	}

	for (const tempAbi of viewFunctionsABIList.withInput) {
		const component = (
			<ContractViewFunction
				address={address}
				name={tempAbi.name}
				inputs={tempAbi.inputs}
				abi={abi}
			/>
		);
		components.push(component);
	}

	return components;
};
