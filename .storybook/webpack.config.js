module.exports = ({config, mode}) => {
  config.output.publicPath = mode === 'PRODUCTION' ? '/next-range-selector/' : '/';
  return config;
};
