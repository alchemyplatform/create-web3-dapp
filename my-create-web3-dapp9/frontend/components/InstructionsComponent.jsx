import styles from "../styles/InstructionsComponent.module.css";

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.logo_container}>
          <h3 className={styles.logo}>🔮</h3>
          <h1>create-web3-dapp</h1>
        </div>
      </header>

      <div className={styles.instructions_container}>
        <div className={styles.box}>
          <a
            target={"_blank"}
            href="https://github.com/alchemyplatform/create-web3-dapp"
          >
            {`Start by deleting the instructions component in the pages/index.jsx file`}
          </a>
        </div>
        <div className={styles.panels_container}>
          <div className={styles.panel}>
            <div style={{flexGrow:1}}>
              <h3>First of all, the docs:</h3>
              <p>
                Learn how to use create-web3-dapp to create and build your dapps
                in minutes
              </p>
            </div>

            <div className={styles.button_container}>
              <a
                className={styles.button}
                target={"_blank"}
                href="https://docs.alchemy.com"
              >
                Read the docs →
              </a>
            </div>
          </div>
          <div className={styles.panel}>
            <div style={{flexGrow:1}}>
              <h3>Production ready web3 components library</h3>
              <p>
                Copy and paste pre-built production ready web3 components into
                your dapp
              </p>
            </div>
            <div className={styles.button_container}>
              <a
                className={styles.button}
                target={"_blank"}
                href="https://createweb3dapp.com"
              >
                Go to the marketplace →
              </a>
            </div>
          </div>
        </div>
        <div className={styles.panel_lg}>
          <div className={styles.title_container}>
            <h3> Check out the production ready project templates</h3>
            <p>Ready to deploy fully-fledged decentralized applications</p>
          </div>

          <div className={styles.templates_container}>
            <div className={styles.template_container}>
              <img src="https://via.placeholder.com/300"></img>
              <div className={styles.template_text_container}>
                <h3>NFTs Gallery</h3>
                <p>
                  A dapp to search and display NFTs, and collections information{" "}
                </p>
              </div>
              <div className={styles.code_block}>
                <p>npx create-web3-dapp@latest nft-gallery</p>
              </div>
            </div>

            <div className={styles.template_container}>
              <img src="https://via.placeholder.com/300"></img>
              <div className={styles.template_text_container}>
                <h3>Buy me a coffee</h3>
                <p>
                  A dapp to search and display NFTs, and collections information{" "}
                </p>
              </div>
              <div
                onClick={() => {
                  navigator.clipboard
                    .writeText("npx create-web3-dapp@latest TBD")
                    .then(() => {
                      alert(
                        "Command copied to your clipboard. Paste it in your terminal!"
                      );
                    });
                }}
                className={styles.code_block}
              >
                <p>npx create-web3-dapp@latest TBD</p>
              </div>
            </div>
            <div className={styles.template_container}>
              <img src="https://via.placeholder.com/300"></img>
              <div className={styles.template_text_container}>
                <h3>Block Explorer</h3>
                <p>
                  A dapp to search and display NFTs, and collections information{" "}
                </p>
              </div>
              <div className={styles.code_block}>
                <p>npx create-web3-dapp@latest block-explorer</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panel_md}>
          <div>
            <h3>Earn your free web3 degree</h3>
            <p>
              Kickstart your web3 career learning from the same bootcamp that
              taught more than 50.000 web3 developers
            </p>
            <div className={styles.button_container_centered}>
              <a
                className={styles.button}
                target={"_blank"}
                href="https://university.alchemy.com"
              >
                Got to Alchemy University →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
