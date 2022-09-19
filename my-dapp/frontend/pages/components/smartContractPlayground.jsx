import { useState } from "react";
import { PrimaryButton } from "./primaryButton";
import alchemy from "../alchemy";
import { ethers } from "ethers";

//TEMP WHILE NOT INTERNET

export const SmartContractPlayground = () => {
	const [contractAddress, setContractAddress] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [components, setComponents] = useState(null);
	const fetchContractABI = () => {
		setLoading(true);
		fetch("/api/getContractAbi", {
			method: "POST",
			body: JSON.stringify({ contractAddress: contractAddress }),
		})
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				const components = generatePlayground(
					data.result,
					contractAddress
				).then((data) => {
					setComponents(data);
				});
			});
	};

	if (isLoading) return <p>Loading...</p>;

	return (
		<div>
			<input
				value={contractAddress}
				onChange={(e) => {
					setContractAddress(e.target.value);
				}}
			></input>
			<PrimaryButton
				text={"fetch abi"}
				onClickCallback={fetchContractABI}
			></PrimaryButton>
			{components && [...components]}
		</div>
	);
};

const generatePlayground = (smartContractABI, contractAddress) => {
	const ABI = JSON.parse(smartContractABI);
	const viewF = {
		withInput: [],
		withoutInput: [],
	};
	const otherF = {
		withInput: [],
		withoutInput: [],
	};

	for (const abi of ABI) {
		if (abi.type == "function") {
			switch (abi.stateMutability) {
				case "view":
					if (abi.inputs.length) {
						const { name, inputs, outputs } = abi;

						viewF.withInput.push({ name, inputs, outputs });
					} else {
						const { name, inputs } = abi;
						viewF.withoutInput.push({ name, inputs });
					}
					break;
				case "pure":
					break;
				case "nonpayable":
					if (abi.inputs.length) {
						const { name, inputs, outputs } = abi;

						otherF.withInput.push({ name, inputs, outputs });
					} else {
						const { name, inputs } = abi;

						otherF.withoutInput.push({ name, inputs });
					}
					break;
				case "payable":
					break;
				default:
					break;
			}
		}
	}
	let components = generateReadOnlyComponent(viewF, ABI, contractAddress);
	return components;
};

const generateReadOnlyComponent = async (viewAbiList, abi, address) => {
	let components = [];
	const provider = await alchemy.config.getProvider();
	const contract = new ethers.Contract(address, abi, provider);
	await viewAbiList.withoutInput.forEach(async (abi) => {
		let output = await contract[abi.name]();
		if (typeof output == "object") {
			console.log(typeof output);

			output = ethers.utils.formatEther(output);
        }
        console.log(output);
		const component = (
			<div>
				<h3>{abi.name}</h3>
				<p>{output}</p>
			</div>
		);
		components.push(component);
	});
	viewAbiList.withInput.forEach((abi) => {
		const component = (
			<div>
				<h3>{abi.name}</h3>
			</div>
		);
		components.push(component);
	});
	return components;
};
