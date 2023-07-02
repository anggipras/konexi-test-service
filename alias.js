const path = require("path");
const moduleAlias = require("module-alias");

const aliases = {
  "@": path.resolve(__dirname, "src"),
  // Add more aliases as needed
};

moduleAlias.addAliases(aliases);
