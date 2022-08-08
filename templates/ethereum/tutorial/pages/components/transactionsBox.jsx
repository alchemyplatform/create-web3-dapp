import { useState } from "react";
import styles from "../../styles/TransactionBox.module.css";
import { BigNumber } from "ethers";
export const TransactionsBox = ({ alchemy }) => {
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setLoading] = useState(false);
	alchemy.ws.once(
		{
			method: "alchemy_pendingTransactions",
			toAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		},
		(transaction) => handleNewTransaction(transaction)
	);

	const handleNewTransaction = (transaction) => {
		const gas = BigNumber.from(transaction.gas).toNumber();
		const gasPrice = BigNumber.from(transaction.gasPrice).toNumber();
		const value = BigNumber.from(transaction.value).toNumber();
		console.log(transaction);
		const newTransaction = {
			to: transaction.to,
			from: transaction.from,
			gas,
			gasPrice,
			totalGas: gas * gasPrice,
			value,
		};
		if (!isLoading) {
			setLoading(true);
			const currentTransactions = [...transactions];
			currentTransactions.push(newTransaction);

			setTransactions(currentTransactions);
			setLoading(false);
		}
	};
	return (
		<div className={styles.transactions_box}>
			{transactions && (
				<table>
					<thead>
						<tr>
							<td>To</td>
							<td>From</td>
							<td>Gas</td>
							<td>Gas Price</td>
							<td>Total Gas</td>
							<td>Value</td>
						</tr>
					</thead>
					<tbody>
						{transactions.map((transaction) => {
							return (
								<tr>
									<td>{transaction.to}</td>
									<td>{transaction.from}</td>
									<td>{transaction.gas}</td>
									<td>{transaction.gasPrice}</td>
									<td>{transaction.totalGas}</td>
									<td>{transaction.value}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};
