// Schema for Gallery Items
module.exports = {
  name: {
    singular: 'Gallery Item',
    plural: 'Gallery Items'
  },
  slug: {
    singular: 'gallery-item',
    plural: 'gallery-items'
  },
  contentfulId: 'galleryItem',
  contentfulFilenameField: 'sys.id',
  collection: {
    sort: 'title',
    reverse: false
  },
  createPage: false
}
