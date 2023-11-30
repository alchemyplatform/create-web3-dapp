import styles from "./instructionsComponent.module.css";

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            create<span>-web3-dapp</span>
          </h1>
          <h3>The ultimate solution to create web3 applications</h3>
        </div>
      </header>

      <div className={styles.buttons_container}>
        <a
          target={"_blank"}
          href={"https://createweb3dapp.alchemy.com/#components"}
        >
          <div className={styles.button}>
            {/* <img src="https://static.alchemyapi.io/images/cw3d/Icon%20Medium/lightning-square-contained-m.svg" width={"20px"} height={"20px"} /> */}
            <p>Add Components</p>
          </div>
        </a>
        <a
          target={"_blank"}
          href={"https://createweb3dapp.alchemy.com/#templates"}
        >
          <div className={styles.button}>
            {/* <img src="https://static.alchemyapi.io/images/cw3d/Icon%20Medium/lightning-square-contained-m.svg" width={"20px"} height={"20px"} /> */}
            <p>Explore Templates</p>
          </div>
        </a>
        <a
          target={"_blank"}
          href={"https://docs.alchemy.com/docs/create-web3-dapp"}
        >
          <div className={styles.button}>
            {/* <img
              src="https://static.alchemyapi.io/images/cw3d/Icon%20Large/file-eye-01-l.svg"
              width={"20px"}
              height={"20px"}
            /> */}
            <p>Visit Docs</p>
          </div>
        </a>
        <a>
          <div className={styles.button}>
            {/* <img src="https://static.alchemyapi.io/images/cw3d/Icon%20Medium/lightning-square-contained-m.svg" width={"20px"} height={"20px"} /> */}
            <p>Contribute</p>
          </div>
        </a>
      </div>
      <p className={styles.get_started}>
        Get started by editing this page in <span>/pages/index.js</span>
      </p>
    </div>
  );
}
