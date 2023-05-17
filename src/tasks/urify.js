/**
 * Serializes the specified file and returns it as a data URI.
 *
 * @param file
 * @returns {Promise<unknown>}
 */
export default file => new Promise( ( resolve, reject ) => {
    const reader = new FileReader();

    reader.addEventListener( 'load', () => resolve( reader.result ) );
    reader.addEventListener( 'error', reject );

    reader.readAsDataURL( file );
} );
