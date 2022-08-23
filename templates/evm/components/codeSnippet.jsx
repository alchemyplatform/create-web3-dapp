import styles from "../../styles/codeSnippet.module.css";


export const CodeSnippet = ({code}) => {
    return (
        
        <div className={styles.container} >
           
            <p className={styles.copy_button} onClick={()=>{navigator.clipboard.writeText(code).then(() => {})}}>copy</p>
            <p>{code}</p>
        </div>
    )
}