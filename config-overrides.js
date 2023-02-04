module.exports = function override(config) {
  if (process.env.DEV_MODE) {
    console.log("DEV MODE")
    config.mode = 'development';
    config.optimization.minimize = false;
    config.resolve.alias['react-dom$'] = 'react-dom/profiling';
    config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
  }
  return config;
};
