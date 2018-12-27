/**
 * Format the provided data pieces and joins them together
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 * @return {String} Concatenated string of all provided pieces
 */
const assemble = (...pieces) => pieces.map(JSON.stringify).join('')

export default assemble
