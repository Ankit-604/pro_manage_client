import CardLoaderStyles from "./styles/CardLoader.module.css";

const CardLoader = () => {
  return (
    <div className={CardLoaderStyles.cardLoader}>
      <div className={CardLoaderStyles.loaderContent}>
        <div className={CardLoaderStyles.loaderTop}></div>
        <div className={CardLoaderStyles.loaderTitle}></div>
        <div className={CardLoaderStyles.loaderDescription}></div>
        <div className={CardLoaderStyles.loaderBottom}>
          <div className={CardLoaderStyles.loaderBottomRight}></div>
          <div className={CardLoaderStyles.loaderBottomRight}></div>
          <div className={CardLoaderStyles.loaderBottomRight}></div>
        </div>
      </div>
    </div>
  );
};
export default CardLoader;
