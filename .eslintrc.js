module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module'
	},
	rules: {
		'no-console': 'off',
		'no-unused-vars': 'off',
		'no-constant-condition': 'off'
	},
  ignorePatterns: ["./dist/**/*.js"]
};
