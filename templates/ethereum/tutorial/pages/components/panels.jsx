import styles from "../../styles/Panel.module.css"
export const Panel = () => {
  return (
    <div className={styles.panel_container}>
      <div className={styles.panel}>
        <div>
          <h2>Learn Alchemy</h2>
          <p>
            {" "}
            Nel mezzo del cammin di nostra vita mi ritrovai per una selva
            oscura, ché la diritta via era smarrita
          </p>
          <div className={styles.button_container}>
            <a className={styles.button} href="#">
              Go there
            </a>
          </div>
        </div>
        <div>
          <h2>Road to web3</h2>
          <p>
            Nel mezzo del cammin di nostra vita mi ritrovai per una selva
            oscura, ché la diritta via era smarrita.
          </p>
          <div className={styles.button_container}>
            <a className={styles.button} href="#">
              Go there
            </a>
          </div>
        </div>
      </div>
      <div className={styles.panel}>
        <div>
          <h2>Request faucet</h2>
          <p>
            Nel mezzo del cammin di nostra vita mi ritrovai per una selva
            oscura, ché la diritta via era smarrita
          </p>
          <div className={styles.button_container}>
            <a className={styles.button} href="#">
              Go there
            </a>
          </div>
        </div>
        <div>
          <h2>Read our docs</h2>
          <p>
            Nel mezzo del cammin di nostra vita mi ritrovai per una selva
            oscura, ché la diritta via era smarrita.
          </p>
          <div className={styles.button_container}>
            <a className={styles.button} href="#">
              Go there
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
