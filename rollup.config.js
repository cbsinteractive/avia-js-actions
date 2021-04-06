import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
	treeshake: {
		moduleSideEffects: false,
	},
	input: 'dist/index.js',
	output: [{
		file: 'dist/index.js',
		format: 'cjs',
		exports: 'auto',
	}],
	plugins: [
		resolve({preferBuiltins: true}),
		commonjs(),
	]
};
