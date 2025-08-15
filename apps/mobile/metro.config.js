const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

const monorepoPackages = {
  "@panelist/api": path.resolve(monorepoRoot, "apps/api"),
};

config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

config.resolver.extraNodeModules = monorepoPackages;
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

config.resolver.sourceExts.push("sql");

module.exports = config;
