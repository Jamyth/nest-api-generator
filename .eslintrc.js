/**
 * @type import('eslint').Linter.Config
 */
const config = {
    ignorePatterns: ['**/test/**', '**/node_modules/**', '**/dist/**'],
    extends: ['iamyth/preset/node'],
    rules: {
        '@typescript-eslint/ban-types': 'off'
    }
}

module.exports = config