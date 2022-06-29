find ./src -name "*.test.js" -exec bash -c 'mv "$1" "${1%.js}".ts' - '{}' \;
find ./src -name "*.component.test.ts" -exec bash -c 'mv "$1" "${1%.ts}".tsx' - '{}' \;
find ./src -name "*.component.ts" -exec bash -c 'mv "$1" "${1%.ts}".tsx' - '{}' \;
find ./src -name "*.js" -exec bash -c 'mv "$1" "${1%.js}".ts' - '{}' \;