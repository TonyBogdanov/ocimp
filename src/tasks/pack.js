/**
 * Packs the specified blob into a File instance with the specified name and modification time.
 *
 * @param blob
 * @param name
 * @param lastModified
 * @returns {File}
 */
export default ( blob, name, lastModified = Date.now() ) => {

    return new File( [ blob ], name, { type: blob.type, lastModified } );

};
