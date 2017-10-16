// Schema for Galleries
module.exports = {
  name: {
    singular: 'Gallery',
    plural: 'Galleries'
  },
  slug: {
    singular: 'gallery',
    plural: 'galleries'
  },
  contentfulId: 'gallery',
  contentfulFilenameField: 'fields.slug',
  collection: {
    sort: 'date',
    reverse: true
  },
  createPage: true,
  pagination: {
    perPage: 10
  }
}
